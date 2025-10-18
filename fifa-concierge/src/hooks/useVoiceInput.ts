import { useCallback, useState, useRef } from 'react';

export const useVoiceInput = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const startListening = useCallback(async () => {
    try {
      setError(null);

      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support audio recording');
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // For now, we'll use the Web Speech API as a fallback
      // In production, this would integrate with Deepgram
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          stream.getTracks().forEach(track => track.stop());
        };

        recognition.start();

        return () => {
          recognition.stop();
          stream.getTracks().forEach(track => track.stop());
        };
      } else {
        // Fallback: Use basic MediaRecorder
        // This is a placeholder - in production, integrate with Deepgram SDK
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          
          // TODO: Send audioBlob to Deepgram API for transcription
          // For now, show a placeholder message
          onTranscript('[Voice input received - Deepgram integration pending]');
          
          stream.getTracks().forEach(track => track.stop());
          setIsListening(false);
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsListening(true);

        // Auto-stop after 5 seconds
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 5000);

        return () => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          stream.getTracks().forEach(track => track.stop());
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsListening(false);
      console.error('Voice input error:', err);
    }
  }, [onTranscript]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsListening(false);
  }, []);

  return { isListening, error, startListening, stopListening };
};

// Deepgram integration function (for when API key is configured)
export const setupDeepgramConnection = async (apiKey: string, onTranscript: (text: string) => void) => {
  try {
    // Get microphone stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create WebSocket connection to Deepgram
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen?punctuate=true&language=en-US', [
      'token',
      apiKey
    ]);

    socket.onopen = () => {
      console.log('Deepgram connection established');
      
      // Create MediaRecorder to send audio to Deepgram
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      });

      mediaRecorder.start(250); // Send data every 250ms
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      
      if (transcript && data.is_final) {
        onTranscript(transcript);
      }
    };

    socket.onerror = (error) => {
      console.error('Deepgram WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Deepgram connection closed');
      stream.getTracks().forEach(track => track.stop());
    };

    return {
      socket,
      stream,
      close: () => {
        socket.close();
        stream.getTracks().forEach(track => track.stop());
      }
    };
  } catch (error) {
    console.error('Failed to setup Deepgram connection:', error);
    throw error;
  }
};
