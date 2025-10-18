# 🚀 Groq Setup Guide - FREE Alternative to AWS Bedrock

This guide will help you set up **Groq** as your AI backend - completely FREE with no credit card required!

## Why Groq?

✅ **FREE** - No credit card needed  
✅ **FAST** - Ultra-fast inference (up to 800 tokens/sec)  
✅ **EASY** - Simple API, works locally  
✅ **POWERFUL** - Access to Llama 3.3 70B and other models  

---

## Step 1: Get Your FREE Groq API Key

1. **Visit Groq Console**: https://console.groq.com/
2. **Sign up** with your email (no credit card!)
3. **Go to API Keys**: https://console.groq.com/keys
4. **Create new API key** - copy it immediately (you won't see it again)

---

## Step 2: Configure Your Environment

Add your Groq API key to your `.env` file:

```bash
# Open your .env file in fifa-concierge folder
# Add this line:
GROQ_API_KEY=your_groq_api_key_here
```

**Example `.env` file:**
```properties
PORT=3001

# Groq API Key (FREE - get from console.groq.com)
GROQ_API_KEY=gsk_your_actual_key_here

# Deepgram API Key (for voice transcription)
REACT_APP_DEEPGRAM_API_KEY=c4c9ff37351f23ad9369b50484b12bc8ada9d526

# Local Groq server endpoint
REACT_APP_API_ENDPOINT=http://localhost:3002

# Feature Flags
REACT_APP_ENABLE_VOICE=true
```

---

## Step 3: Install Server Dependencies

```powershell
# Navigate to server folder
cd server

# Install dependencies
npm install

# This installs: express, cors, groq-sdk
```

---

## Step 4: Start the Groq Server

```powershell
# Make sure you're in the server folder
cd server

# Start the server
npm start

# You should see:
# 🚀 Groq FIFA Concierge Server running on http://localhost:3002
# 📝 Chat endpoint: http://localhost:3002/chat
# 💚 Health check: http://localhost:3002/health
# 🔑 Groq API Key configured: ✅ Yes
```

---

## Step 5: Start Your Frontend

In a **NEW PowerShell terminal**:

```powershell
# Navigate to fifa-concierge folder
cd c:\Users\mk504221\Projects\aws-agentic-hackathon-lax\fifa-concierge

# Start the React app
npm start

# Opens http://localhost:3001
```

---

## Step 6: Test It Out!

1. **Open your browser**: http://localhost:3001/chat
2. **Test text chat**: 
   - Type: "When is USA vs Mexico playing?"
   - You should get an AI response from Groq!
3. **Test voice**: 
   - Click the microphone button 🎤
   - Speak your question
   - See it transcribed (Deepgram) and get AI response (Groq)

---

## 🔍 Troubleshooting

### "Groq API Key configured: ❌ No"
- Make sure `GROQ_API_KEY` is set in your `.env` file
- Restart the server after adding the key
- Check for typos in the key

### "No response from server"
- Make sure the Groq server is running on port 3002
- Check `REACT_APP_API_ENDPOINT=http://localhost:3002` in `.env`
- Restart the frontend after changing `.env`

### Voice not working
- Make sure `REACT_APP_DEEPGRAM_API_KEY` is set correctly
- Allow microphone permissions in your browser
- Check browser console for errors

---

## 📊 What You Get

- **Model**: Llama 3.3 70B Versatile (very capable!)
- **Speed**: Extremely fast responses (~800 tokens/sec)
- **Rate Limits**: 30 requests/min, 14,400/day (FREE tier)
- **Cost**: $0.00 - Completely FREE!

---

## 🎯 Quick Commands Summary

```powershell
# Terminal 1 - Start Groq Server
cd server
npm install  # First time only
npm start

# Terminal 2 - Start Frontend
cd ..
npm start

# Then visit: http://localhost:3001/chat
```

---

## 🆚 Groq vs AWS Bedrock

| Feature | Groq | AWS Bedrock |
|---------|------|-------------|
| Cost | FREE | Requires credit card |
| Setup | 5 minutes | 30+ minutes |
| Speed | Ultra-fast | Fast |
| Models | Llama 3.3 70B | Claude 3.5 Sonnet |
| Deployment | Local server | Cloud (Lambda, API Gateway) |

---

## ✅ You're All Set!

You now have:
- ✅ **Voice-to-text** working (Deepgram)
- ✅ **AI chat** working (Groq)
- ✅ **No AWS required**
- ✅ **No credit card needed**
- ✅ **Everything running locally**

Enjoy your FIFA World Cup chatbot! ⚽🎉
