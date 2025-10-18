# 🎯 FIFA Concierge - Voice-Powered AI Chatbot

**Voice-powered FIFA World Cup 2026 chatbot** using FREE Groq AI (no credit card needed!)

## ✅ What's Working

- ✅ **Voice-to-Text**: Deepgram (configured and ready!)
- ✅ **AI Chat**: Groq Llama 3.3 70B (FREE - no AWS, no credit card!)
- ✅ **Local Server**: Everything runs on your machine
- ✅ **Zero Cost**: Both services have generous free tiers

---

## 🚀 Quick Start (3 Steps!)

### 1️⃣ Get Your FREE Groq API Key

1. Visit: **https://console.groq.com/keys**
2. Sign up (email only, no credit card!)
3. Click "Create API Key"
4. Copy your key (starts with `gsk_`)

### 2️⃣ Add Your Key to `.env`

Open `.env` file and replace `your_groq_api_key_here` with your actual key:
```properties
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3️⃣ Start Everything!

**Option A - Automated (Opens 2 windows):**
```powershell
.\start.ps1
```

**Option B - Manual (2 separate terminals):**

Terminal 1 (Groq Backend):
```powershell
cd server
npm start
```

Terminal 2 (React Frontend):
```powershell
npm start
```

**Then open**: http://localhost:3001/chat

---

## 🎤 Test Voice & AI

1. **Text chat**: Type "When is USA vs Mexico playing?"
2. **Voice chat**: Click microphone 🎤 and speak!
3. **Allow microphone** permissions when prompted

---

## 📚 Documentation

- **GROQ_SETUP.md** - Complete setup guide with troubleshooting
- **Server**: `server/groqServer.js` - Groq AI backend
- **Frontend**: `src/components/ChatInterface.tsx` - Voice + chat UI

---

## 💰 It's Completely FREE!

| Service | Cost | What You Get |
|---------|------|--------------|
| Deepgram Voice | FREE | 45,000 minutes/month |
| Groq AI | FREE | 14,400 requests/day |
| **Total** | **$0.00** | No credit card needed! |

---

## 🆘 Troubleshooting

**Voice not working?**
- Allow microphone permissions in browser
- Deepgram key is already in `.env` ✅

**AI not responding?**
- Make sure Groq server is running (see Terminal 1)
- Check that `GROQ_API_KEY` is in `.env`
- Visit http://localhost:3002/health to test server

**Need help?**
- See **GROQ_SETUP.md** for detailed instructions
- Check server logs for error messages

---

# Original Create React App Documentation

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
