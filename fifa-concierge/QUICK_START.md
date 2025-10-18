# 🚀 FIFA Concierge - Quick Start

## ✅ Your Setup is Ready!

- **Groq API Key**: Valid ✅ (tested against Groq API)
- **Model**: `llama-3.3-70b-versatile` (current, not deprecated)
- **Frontend**: Running on http://localhost:3001
- **Environment**: All configured in `.env`

---

## 🎯 Start Both Servers

### Terminal 1 - Groq Backend
```powershell
cd c:\Users\mk504221\Projects\aws-agentic-hackathon-lax\fifa-concierge\server
npm start
```

**Wait for:**
```
🚀 Groq FIFA Concierge Server running on http://localhost:3002
🔑 Groq API Key configured: ✅ Yes
```

### Terminal 2 - React Frontend
```powershell
cd c:\Users\mk504221\Projects\aws-agentic-hackathon-lax\fifa-concierge
npm start
```

**Browser opens automatically to:** http://localhost:3001

---

## 🧪 Test It

1. **Open**: http://localhost:3001/chat
2. **Type**: "When is USA vs Mexico playing?"
3. **Click Send** → Get AI response!
4. **Click Microphone** 🎤 → Speak → Get transcribed + AI response!

---

## 🛑 If "Connection Error" or "Invalid API Key"

### Stop Everything
```powershell
taskkill /F /IM node.exe
```

### Restart Backend
```powershell
cd c:\Users\mk504221\Projects\aws-agentic-hackathon-lax\fifa-concierge\server
npm start
```

### Restart Frontend (in new terminal)
```powershell
cd c:\Users\mk504221\Projects\aws-agentic-hackathon-lax\fifa-concierge
npm start
```

---

## ✅ What's Configured

| Component | Status | Details |
|-----------|--------|---------|
| Groq API Key | ✅ Valid | `gsk_psstStO...` (tested) |
| Model | ✅ Current | `llama-3.3-70b-versatile` |
| Deepgram Voice | ✅ Configured | API key in `.env` |
| Frontend | ✅ Ready | Port 3001 |
| Backend | ✅ Ready | Port 3002 |

---

## 🎤 Voice Setup

1. Click microphone button in chat
2. Browser asks for permission → **Allow**
3. Speak your question
4. See transcription appear
5. Get AI response!

---

## 💡 Common Issues

### "localhost refused to connect"
- Backend not running → Start Terminal 1 (server)
- Check: http://localhost:3002/health should show `{"status":"healthy"}`

### "Invalid Groq API key"
- Restart the backend server (Terminal 1)
- API key is valid, just needs server restart

### Voice not working
- Allow microphone permissions
- Deepgram key is already configured ✅

---

## 🎉 You're Ready!

Your FIFA World Cup AI chatbot with voice is configured and tested! Just start both servers and go to http://localhost:3001/chat

**Both services are FREE - no credit card needed!**
