fetch('http://localhost:3002/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'When is USA vs Mexico playing?',
    conversationHistory: []
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ SUCCESS!');
  console.log('Model:', d.model);
  console.log('Response:', d.response.substring(0, 200));
  console.log('\n🎉 Your Groq API is working!');
})
.catch(e => console.error('❌ Error:', e.message));
