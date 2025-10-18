const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const data = JSON.stringify({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: 'ping' }],
  max_tokens: 10,
});

const options = {
  hostname: 'api.groq.com',
  port: 443,
  path: '/openai/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Length': data.length,
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      const parsed = JSON.parse(body);
      console.log('✅ API key is VALID');
      console.log('Response:', parsed.choices[0].message.content);
    } else {
      console.log('❌ API key is INVALID or error occurred');
      console.log('Response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
