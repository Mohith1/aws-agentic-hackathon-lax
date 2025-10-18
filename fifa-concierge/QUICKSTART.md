# ⚡ Quick Start Guide - FIFA 2026 AI Concierge

## 🎯 Get Running in 5 Minutes

### Step 1: Start the Development Server
```bash
cd fifa-concierge
npm start
```

The app will open at **http://localhost:3000**

### Step 2: Explore the App

#### 📊 Dashboard (Home Page)
- View upcoming matches
- See personalized recommendations
- Access quick action buttons
- Check live updates

#### 💬 AI Chat (`/chat`)
Try these queries:
- "When is USA vs Mexico playing?"
- "Find me restaurants near SoFi Stadium"
- "How do I get to Rose Bowl?"
- "What's the weather like?"
- "I need translation help"

#### 🗺️ Venue Map (`/map`)
- Click on stadium markers
- View transportation options
- See route planning

#### 👤 Profile (`/profile`)
- View user preferences
- Check saved itineraries
- See stats

### Step 3: Test Voice Input (Optional)

1. Go to Chat page
2. Click the microphone 🎤 button
3. Allow microphone access
4. Speak your query
5. See it transcribed and answered

**Note**: Voice uses browser Speech Recognition API as fallback. For production, add Deepgram API key to `.env`

---

## 🔧 Configuration (Optional)

### Add Deepgram Voice API
```bash
# Create .env file
cp .env.example .env

# Add your Deepgram API key
REACT_APP_DEEPGRAM_API_KEY=your-key-here
REACT_APP_ENABLE_VOICE=true
```

### Deploy to AWS (Advanced)
```bash
# Install Pulumi
choco install pulumi  # Windows
brew install pulumi   # macOS

# Deploy infrastructure
cd pulumi
npm install
pulumi login
pulumi up

# Copy API endpoint output to .env
REACT_APP_API_ENDPOINT=<your-api-gateway-url>
```

---

## 🎨 What You'll See

### Homepage Features
- ✅ Match schedule cards with flags and venues
- ✅ Quick action buttons (Book Ride, Find Food, etc.)
- ✅ Recommended activities with ratings
- ✅ Live updates feed
- ✅ FIFA 2026 branding

### Chat Features
- ✅ Intelligent responses to common queries
- ✅ Match schedules and venue info
- ✅ Restaurant recommendations
- ✅ Navigation and transportation help
- ✅ Weather updates
- ✅ Translation services
- ✅ Voice input support

### Map Features
- ✅ Interactive stadium locations
- ✅ SoFi Stadium, Rose Bowl, LA Coliseum
- ✅ Transportation options with costs
- ✅ Route visualization

---

## 📱 Mobile Testing

The app is fully responsive! Test on mobile:

1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select iPhone/Android device
4. Navigate through pages

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Find and kill process on port 3000
npx kill-port 3000

# Or start on different port
PORT=3001 npm start
```

### Issue: Tailwind styles not loading
**Solution**: 
```bash
# Rebuild
npm run build
npm start
```

### Issue: Map not showing
**Solution**: 
- Ensure you have internet connection
- Map tiles load from OpenStreetMap CDN
- Check browser console for errors

### Issue: Voice input not working
**Solution**:
- Use Chrome, Edge, or Safari (Firefox has limited support)
- Allow microphone permissions when prompted
- Check browser console for errors

---

## 🎯 Demo Tips

### Best Flow for Presentation

1. **Start on Dashboard** - Show overview
2. **Click "Match Schedule"** quick action → Opens chat
3. **Type query** in chat - Show AI response
4. **Click microphone** - Demo voice input
5. **Navigate to Map** - Show stadium locations
6. **Click stadium marker** - Show details
7. **Back to Dashboard** - Show recommendations

### Impressive Queries to Demo

```
"When is USA vs Mexico playing?"
→ Shows detailed match info

"Find me restaurants near SoFi Stadium under $30"
→ Shows personalized recommendations

"How do I get to the stadium from downtown LA?"
→ Shows navigation options

"What's the weather forecast?"
→ Shows weather details

"Help me translate to Spanish"
→ Shows translation options

"I need tickets for Brazil vs Argentina"
→ Shows ticket information
```

---

## 📊 Tech Stack at a Glance

**Frontend**:
- React 19 + TypeScript
- Tailwind CSS (FIFA colors)
- React Router (navigation)
- Leaflet (maps)
- Lucide React (icons)

**Backend** (Ready to Deploy):
- AWS Lambda (serverless)
- Amazon Bedrock (Claude 4.5)
- DynamoDB (database)
- API Gateway (endpoints)
- EventBridge (events)
- SNS (notifications)

**Integrations** (Configured):
- Deepgram (voice)
- Akeyless (secrets)
- Pulumi (IaC)

---

## ⏱️ Quick Commands

```bash
# Development
npm start              # Start dev server
npm test              # Run tests
npm run build         # Build for production

# Deployment
cd pulumi
pulumi up             # Deploy AWS infrastructure

# Code Quality
npm run lint          # Check code
npm run format        # Format code
```

---

## 🚀 Next Steps

1. **Customize**: Update user profile, add more matches
2. **Integrate**: Connect real APIs (weather, maps, etc.)
3. **Deploy**: Push to AWS Amplify or Vercel
4. **Enhance**: Add more features (booking, payments, etc.)

---

## 📞 Need Help?

- Check `PROJECT_SUMMARY.md` for complete overview
- See `DEPLOYMENT.md` for AWS deployment
- Review `PROJECT_DOCS.md` for detailed docs
- Open browser DevTools console for errors

---

**You're all set! The app is running at http://localhost:3000** 🎉⚽🏆

**Enjoy exploring the FIFA World Cup 2026 AI Concierge!**
