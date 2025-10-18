import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, Send, Globe, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { getDeepgramService } from '../services/deepgramService';
import { chatApi } from '../services/chatApi';
import { QuickActions } from './QuickActions/QuickActions';
import { detectIntent } from '../services/intentDetector';
import { DeepLinkService } from '../services/deepLinkService';
import { VenueService } from '../services/venueService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Welcome to FIFA World Cup 2026! 🏆⚽ I'm your AI concierge. I can help you with match schedules, venue navigation, restaurant recommendations, translations, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const deepgramServiceRef = useRef(getDeepgramService());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Detect intents and trigger appropriate deep links
    try {
      const intent = detectIntent(text);
      console.debug('Detected intent:', intent);
      
      if (intent) {
        const venues = VenueService.getAllVenues();
        const defaultVenue = venues[0]; // Use first venue as default location
        
        switch (intent.type) {
          case 'ride':
            // Open Uber with start and destination
            if (intent.data.destination) {
              DeepLinkService.openRideBookingFromAddresses('uber', intent.data.start, intent.data.destination);
            }
            break;
            
          case 'restaurant':
            // Open Yelp with search term and location
            if (intent.data.location) {
              // Try to find venue by location name
              const venue = venues.find(v => 
                v.city.toLowerCase().includes(intent.data.location.toLowerCase()) ||
                v.name.toLowerCase().includes(intent.data.location.toLowerCase())
              ) || defaultVenue;
              DeepLinkService.openYelp(venue);
            } else {
              DeepLinkService.openYelp(defaultVenue);
            }
            break;
            
          case 'place':
            // Open navigation to place
            const placeVenue = venues.find(v => 
              v.name.toLowerCase().includes(intent.data.placeName.toLowerCase())
            );
            if (placeVenue) {
              DeepLinkService.openNavigation(placeVenue);
            }
            break;
            
          case 'translate':
            // Open Google Translate with text and target language
            const langMap: { [key: string]: string } = {
              'spanish': 'es', 'french': 'fr', 'english': 'en',
              'german': 'de', 'italian': 'it', 'portuguese': 'pt',
              'chinese': 'zh', 'japanese': 'ja', 'korean': 'ko', 'arabic': 'ar'
            };
            const targetLang = intent.data.targetLang ? langMap[intent.data.targetLang] || 'es' : 'es';
            DeepLinkService.openTranslate(undefined, intent.data.text);
            break;
            
          case 'tickets':
            // Open FIFA tickets page
            DeepLinkService.openTickets();
            break;
            
          case 'navigate':
            // Open navigation to destination
            const navVenue = venues.find(v => 
              v.name.toLowerCase().includes(intent.data.destination.toLowerCase()) ||
              v.city.toLowerCase().includes(intent.data.destination.toLowerCase())
            );
            if (navVenue) {
              DeepLinkService.openNavigation(navVenue);
            }
            break;
        }
      }
    } catch (err) {
      console.warn('Intent detection/redirect failed', err);
    }

    setIsLoading(true);
    setApiError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Call the real AWS Bedrock API via API Gateway
      const response = await chatApi.sendMessage({
        message: text,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        userId: 'user-' + Date.now(), // TODO: Replace with actual user ID from Cognito
      });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp)
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setApiError(errorMsg);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the AI service. Please check your connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (isListening) {
        // Stop listening
        deepgramServiceRef.current.stopListening();
        setIsListening(false);
        setInterimTranscript('');
      } else {
        // Start listening
        setIsListening(true);
        setApiError(null);
        
        await deepgramServiceRef.current.startListening(
          (result) => {
            if (result.isFinal) {
              // Final transcript - add to input
              setInput(prev => (prev + ' ' + result.transcript).trim());
              setInterimTranscript('');
            } else {
              // Interim transcript - show in real-time
              setInterimTranscript(result.transcript);
            }
          },
          (error) => {
            console.error('Deepgram error:', error);
            setApiError(`Voice input error: ${error.message}`);
            setIsListening(false);
            setInterimTranscript('');
          }
        );
      }
    } catch (error) {
      console.error('Voice input error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to start voice input';
      setApiError(errorMsg);
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  const quickActions = [
    { icon: <Calendar className="w-4 h-4" />, text: "Match Schedule" },
    { icon: <MapPin className="w-4 h-4" />, text: "Nearby Venues" },
    { icon: <Globe className="w-4 h-4" />, text: "Translate" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center justify-between border-b-4 border-fifa-blue">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-fifa-blue rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-fifa-blue">
              FIFA World Cup 2026
            </h1>
            <p className="text-sm text-gray-600">
              🤖 AI Concierge • Los Angeles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-fifa-green text-white px-3 py-1 rounded-full font-semibold">
            ● LIVE
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b px-4 py-3">
        {apiError && (
          <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Connection Error</p>
              <p className="text-xs text-red-600 mt-1">{apiError}</p>
            </div>
          </div>
        )}
        <div className="flex gap-2 overflow-x-auto">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(action.text)}
              className="flex items-center gap-2 px-4 py-2 bg-fifa-blue/10 hover:bg-fifa-blue/20 text-fifa-blue rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105"
            >
              {action.icon}
              {action.text}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions Panel */}
      {messages.length === 1 && (
        <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50">
          <QuickActions 
            onActionClick={(actionId) => {
              console.log('Quick action clicked:', actionId);
            }}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] rounded-2xl p-4 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-fifa-blue to-blue-600 text-white'
                  : 'bg-white text-gray-800 border-2 border-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              <div
                className={`text-xs mt-2 ${
                  msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-fifa-blue rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-fifa-gold rounded-full animate-bounce delay-100" />
                <div className="w-3 h-3 bg-fifa-green rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-gray-100 p-4 shadow-lg">
        {/* Interim transcript display */}
        {interimTranscript && (
          <div className="mb-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 italic">Listening: "{interimTranscript}"</p>
          </div>
        )}
        
        <div className="flex gap-3 items-center max-w-4xl mx-auto">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-fifa-green text-white hover:bg-green-600'
            } hover:scale-110 shadow-lg`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask me anything about the World Cup..."
            className="flex-1 border-2 border-gray-200 rounded-full px-6 py-3 focus:border-fifa-blue focus:outline-none focus:ring-2 focus:ring-fifa-blue/20 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-gradient-to-r from-fifa-blue to-blue-600 text-white hover:from-blue-600 hover:to-fifa-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 shadow-lg"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          Powered by AWS Bedrock • Claude 3.5 Sonnet • Deepgram
        </div>
      </div>
    </div>
  );
};
