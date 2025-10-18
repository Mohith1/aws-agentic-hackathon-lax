import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:3002';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  userId?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export const chatApi = {
  /**
   * Send a message to the AWS Bedrock Agent via API Gateway
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(
        `${API_ENDPOINT}/chat`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error
          console.error('API Error Response:', error.response.data);
          throw new Error(error.response.data.error || 'Failed to get response from AI');
        } else if (error.request) {
          // No response received
          console.error('API No Response:', error.request);
          throw new Error('No response from server. Please check your connection.');
        }
      }
      
      console.error('API Error:', error);
      throw new Error('Failed to communicate with AI service');
    }
  },

  /**
   * Health check for the API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};
