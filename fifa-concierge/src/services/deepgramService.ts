import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

interface DeepgramConfig {
  apiKey: string;
}

interface TranscriptionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class DeepgramService {
  private client: any;
  private connection: any;
  private mediaRecorder: MediaRecorder | null = null;
  private isActive = false;
  private wsEverOpened = false;

  // Web Speech API fallback
  private recognition: any | null = null;

  constructor(private config: DeepgramConfig) {
    this.client = createClient(config.apiKey);
  }

  async startListening(
    onTranscript: (result: TranscriptionResult) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      // Quick sanity log to help diagnose key issues without leaking full key
      const key = this.config.apiKey || '';
      console.log('[Voice] Starting Deepgram with key present:', Boolean(key), 'len:', key?.length || 0);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      // Create Deepgram live transcription connection
      this.connection = this.client.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        interim_results: true,
        punctuate: true,
        utterance_end_ms: 1000,
        vad_events: true,
        // Important when sending MediaRecorder webm chunks
        encoding: 'webm',
      });

      // Set up event listeners
      this.connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Deepgram connection opened');
        this.isActive = true;
        this.wsEverOpened = true;

        // Set up MediaRecorder to capture audio
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && this.connection && this.isActive) {
            this.connection.send(event.data);
          }
        });

        // Start recording with 250ms chunks for real-time streaming
        this.mediaRecorder.start(250);
      });

      this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        const confidence = data.channel?.alternatives?.[0]?.confidence || 0;
        const isFinal = data.is_final;

        if (transcript && transcript.trim().length > 0) {
          onTranscript({
            transcript,
            confidence,
            isFinal,
          });
        }
      });

      this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
        console.error('Deepgram error:', error);
        // If WS failed to ever open (common if blocked by network/proxy or bad key), try fallback
        if (!this.wsEverOpened) {
          console.warn('[Voice] Deepgram WS did not open. Falling back to Web Speech API.');
          this.startWebSpeechFallback(onTranscript, onError);
          return;
        }
        if (onError) onError(error instanceof Error ? error : new Error(String(error)));
      });

      this.connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed');
        this.cleanup(stream);
        // If it closed immediately without ever opening, attempt fallback once
        if (!this.wsEverOpened) {
          console.warn('[Voice] Deepgram WS closed early. Falling back to Web Speech API.');
          this.startWebSpeechFallback(onTranscript, onError);
        }
      });

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to start voice input');
      console.error('Voice input error:', err);
      // If getUserMedia fails or anything else, try Web Speech API as a last resort
      console.warn('[Voice] getUserMedia or setup failed. Trying Web Speech API fallback.');
      try {
        this.startWebSpeechFallback(onTranscript, onError);
        return;
      } catch (inner) {
        if (onError) onError(err);
      }
      throw err;
    }
  }

  stopListening(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.connection) {
      this.connection.finish();
      this.connection = null;
    }

    this.isActive = false;
  }

  private cleanup(stream: MediaStream): void {
    stream.getTracks().forEach(track => track.stop());
    
    if (this.mediaRecorder) {
      this.mediaRecorder = null;
    }
    
    this.isActive = false;
  }

  // --- Web Speech API Fallback (Chrome/Edge) ---
  private startWebSpeechFallback(
    onTranscript: (result: TranscriptionResult) => void,
    onError?: (error: Error) => void
  ) {
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const err = new Error('Voice fallback not available: Web Speech API unsupported in this browser.');
      if (onError) onError(err);
      throw err;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.continuous = true;

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const isFinal = event.results[event.results.length - 1].isFinal;
        onTranscript({ transcript, confidence: 0.9, isFinal });
      };

      this.recognition.onerror = (e: any) => {
        console.error('[Voice Fallback] Web Speech error:', e);
        if (onError) onError(new Error(e?.error || 'Web Speech error'));
      };

      this.recognition.onend = () => {
        console.log('[Voice Fallback] Recognition ended');
      };

      this.recognition.start();
      this.isActive = true;
      console.log('[Voice Fallback] Web Speech API started');
    } catch (e: any) {
      console.error('[Voice Fallback] Failed to start:', e);
      if (onError) onError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    }
  }

  isListening(): boolean {
    return this.isActive;
  }
}

// Singleton instance
let deepgramInstance: DeepgramService | null = null;

export const getDeepgramService = (): DeepgramService => {
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  
  if (!apiKey) {
    throw new Error('REACT_APP_DEEPGRAM_API_KEY is not configured. Please add it to your .env file.');
  }

  if (!deepgramInstance) {
    deepgramInstance = new DeepgramService({ apiKey });
  }

  return deepgramInstance;
};
