const https = require('https');

const data = JSON.stringify({
  message: 'Hello, tell me about FIFA World Cup 2026',
  conversationHistory: [],
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = require('http').request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      const parsed = JSON.parse(body);
      console.log('✅ Chat endpoint working!');
      console.log('Model:', parsed.model);
      console.log('Response:', parsed.response.substring(0, 150) + '...');
    } else {
      console.log('❌ Error:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
