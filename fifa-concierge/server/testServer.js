require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const PORT = 3002;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log('Starting server setup...');

// Initialize Groq client
const groq = new Groq({ apiKey: GROQ_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'healthy', service: 'Groq FIFA Concierge' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    console.log('Chat request received:', req.body);
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful FIFA World Cup 2026 assistant.'
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Calling Groq API...');
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    console.log('Got response from Groq');

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      model: 'llama-3.3-70b-versatile',
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Failed to process chat request',
      details: error?.message || 'Unknown error',
    });
  }
});

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Chat endpoint: http://localhost:${PORT}/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 API Key: ${GROQ_API_KEY.slice(0, 6)}...`);
  console.log('Server is ready to accept requests');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

console.log('Setup complete, waiting for listen callback...');
