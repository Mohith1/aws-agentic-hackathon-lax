const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const path = require('path');
const fs = require('fs');

// Load environment variables from parent directory's .env file (best effort)
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

const app = express();
const PORT = process.env.SERVER_PORT || 3002;

// Resolve and sanitize API key — prefer the .env file content if present and valid.
function readGroqKeyFromDotenvFile() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) return '';
    const content = fs.readFileSync(envPath, 'utf8');
    // Find the last occurrence to emulate typical override behavior
    const lines = content.split(/\r?\n/).filter(Boolean);
    const matches = lines.filter(l => /^\s*GROQ_API_KEY\s*=/.test(l));
    if (matches.length === 0) return '';
    const last = matches[matches.length - 1];
    const val = last.split('=', 2)[1]?.trim();
    if (!val) return '';
    // Strip wrapping quotes if any
    const unquoted = val.replace(/^['"]|['"]$/g, '').trim();
    return unquoted;
  } catch (_) {
    return '';
  }
}

const fileKey = readGroqKeyFromDotenvFile();
const envKey = (process.env.GROQ_API_KEY || '').trim();
let GROQ_API_KEY = '';

// Prefer a valid-looking key from file; else env
if (fileKey && /^gsk_/.test(fileKey)) {
  GROQ_API_KEY = fileKey;
} else if (envKey && /^gsk_/.test(envKey)) {
  GROQ_API_KEY = envKey;
} else {
  // Keep whatever is available (for error reporting), but likely invalid
  GROQ_API_KEY = fileKey || envKey || '';
}

// Initialize Groq client
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Groq FIFA Concierge', groqApiKeyPresent: Boolean(GROQ_API_KEY), keyPrefix: GROQ_API_KEY ? GROQ_API_KEY.slice(0,4) : null });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GROQ_API_KEY) {
      return res.status(401).json({
        error: 'Invalid Groq API key. Please check your GROQ_API_KEY environment variable.',
        hint: 'Ensure .env has GROQ_API_KEY without quotes and restart the server',
      });
    }

    console.log(`[${new Date().toISOString()}] Chat request from ${userId || 'anonymous'}: ${message}`);

    // Build messages array for Groq
    const messages = [
      {
        role: 'system',
        content: `You are a helpful FIFA World Cup 2026 assistant. You provide information about:
- Match schedules and venues
- Team information and players
- Tickets and how to purchase them
- Travel information for host cities (USA, Mexico, Canada)
- World Cup history and statistics

Be friendly, concise, and accurate. If you don't know something, admit it rather than making up information.`
      },
      // Include conversation history
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add current message
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API
    const modelId = 'llama-3.3-70b-versatile'; // Current Groq model (as of Oct 2025)
    console.log(`[Groq] Using model: ${modelId}`);
    console.log('[Groq] Request payload:', JSON.stringify({ messages, modelId }, null, 2));
    
    const completion = await groq.chat.completions.create({
      model: modelId,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    console.log('[Groq] Raw API response:', JSON.stringify(completion, null, 2));
    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log(`[${new Date().toISOString()}] AI Response: ${aiResponse.substring(0, 100)}...`);

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      model: modelId,
    });

  } catch (error) {
    // Normalize error details
    const status = error?.status || error?.response?.status;
    const errData = error?.response?.data || error?.data || null;
    console.error('Error processing chat request:', { status, message: error?.message, data: errData });

    if (status === 401) {
      return res.status(401).json({
        error: 'Invalid Groq API key. Please check your GROQ_API_KEY environment variable.',
        hint: 'Regenerate a key at https://console.groq.com/keys, update .env, and restart the server',
      });
    }

    res.status(500).json({
      error: 'Failed to process chat request',
      details: error?.message || 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Groq FIFA Concierge Server running on http://localhost:${PORT}`);
  console.log(`📝 Chat endpoint: http://localhost:${PORT}/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  const mask = (k) => (k && k.length >= 12 ? `${k.slice(0, 6)}…${k.slice(-4)}` : 'n/a');
  console.log(`\n🔑 Groq API Key configured: ${GROQ_API_KEY ? '✅ Yes' : '❌ No - Please set GROQ_API_KEY'}`);
  if (GROQ_API_KEY) {
    console.log(`🔒 Using key: ${mask(GROQ_API_KEY)} (trimmed)`);
  }
});

module.exports = app;
