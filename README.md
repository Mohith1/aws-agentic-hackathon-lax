# ⚽ FIFA 2026 World Cup Concierge

> An intelligent AI-powered concierge application for the FIFA World Cup 2026, featuring voice interaction, context-aware deep linking, and real-time assistance for fans attending matches across North America.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-FF6B6B)](https://groq.com/)
[![Deepgram](https://img.shields.io/badge/Deepgram-Voice_AI-13EF93)](https://deepgram.com/)

## 🌟 Overview

FIFA 2026 Concierge is a comprehensive web application designed to enhance the experience of FIFA World Cup 2026 attendees. It combines AI-powered chat, voice recognition, and intelligent deep linking to help fans with:

- 🚗 **Transportation** - Book Uber rides to stadiums with context-aware routing
- 🍽️ **Dining** - Find restaurants near venues with cuisine preferences
- 🗺️ **Navigation** - Get directions to stadiums and points of interest  
- 🌐 **Translation** - Real-time language translation for international fans
- 🎟️ **Tickets** - Access official FIFA ticketing and match information
- ℹ️ **Information** - AI-powered answers about matches, venues, and schedules

## ✨ Demo 
Drive Link - https://drive.google.com/file/d/1qKnGZiOByv1pazdDdxTH_Q-fLmuTZu33/view?usp=sharing

## ✨ Presentation
PDF Link - https://drive.google.com/file/d/1U1kXdM7JdpmYPbwlaMu9XF23-V8SLhN4/view?usp=sharing

## ✨ Key Features

### 🤖 AI-Powered Chat
- **Free Groq AI Integration** - Uses Llama 3.3 70B model (no credit card required!)
- **Natural Language Understanding** - Ask questions in plain English
- **Context-Aware Responses** - Understands your location and preferences
- **Real-time Assistance** - Instant answers about matches, venues, and logistics

### 🎤 Voice Interaction
- **Deepgram Voice-to-Text** - High-accuracy speech recognition
- **Hands-free Operation** - Perfect for on-the-go fans
- **Multi-language Support** - English and Spanish voice recognition
- **45,000 free minutes/month** - No cost for personal use

### 🔗 Smart Deep Linking
- **Context-Aware Actions** - Automatically detects intent from conversations
- **Multi-Platform Support** - Works on iOS, Android, and desktop browsers
- **Six Intent Types**:
  1. **Ride Booking** - Uber integration with address extraction
  2. **Restaurant Search** - Yelp integration with cuisine and location
  3. **Place Discovery** - Google Maps for attractions and venues
  4. **Translation** - Google Translate for language assistance
  5. **Ticket Access** - Direct links to FIFA official ticketing
  6. **Navigation** - Turn-by-turn directions to stadiums

### 🏟️ Stadium & Venue Information
- **16 Official Venues** across USA, Mexico, and Canada
- **Match Schedules** - Upcoming games and team information
- **Venue Details** - Capacity, location, and amenities
- **Interactive Maps** - Visual representation of stadium locations

### 📱 Quick Actions Dashboard
- **Pre-configured shortcuts** for common tasks
- **One-tap access** to rides, food, tickets, and navigation
- **Personalized recommendations** based on user behavior
- **Mobile-optimized interface** for on-the-go access

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection for AI services

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mohith1/aws-agentic-hackathon-lax.git
cd aws-agentic-hackathon-lax/fifa-concierge
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Get your FREE API keys**

#### Groq AI (Required for Chat)
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up with email (no credit card needed)
3. Click "Create API Key"
4. Copy your key (starts with `gsk_`)

#### Deepgram Voice (Optional - for Voice Features)
1. Visit [Deepgram Console](https://console.deepgram.com/)
2. Sign up for free account
3. Create a new API key
4. Copy your key

4. **Configure environment variables**

Create a `.env` file in the `fifa-concierge` directory:
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```properties
GROQ_API_KEY=gsk_your_actual_groq_key_here
REACT_APP_DEEPGRAM_API_KEY=your_deepgram_key_here  # Optional
```

5. **Start the application**

**Option A - Automated (Recommended):**
```powershell
.\start.ps1
```
This opens both frontend and backend in separate windows.

**Option B - Manual (Two terminals):**

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
npm start
```

6. **Access the application**
- Frontend: http://localhost:3001
- Chat Interface: http://localhost:3001/chat
- Backend API: http://localhost:3002
- Health Check: http://localhost:3002/health

---

## � Usage Guide

### Chat Interface
1. Navigate to http://localhost:3001/chat
2. Type your question in the chat input
3. Examples:
   - "When is the USA vs Mexico match?"
   - "I need a ride to SoFi Stadium"
   - "Find Italian restaurants near MetLife Stadium"
   - "How do I get to Azteca Stadium?"
   - "Translate 'Where is the bathroom?' to Spanish"

### Voice Interaction
1. Click the microphone icon 🎤
2. Allow microphone permissions when prompted
3. Speak your question clearly
4. The AI will transcribe and respond

### Quick Actions
- Click any quick action card on the dashboard
- Automatically redirects to appropriate service
- Pre-filled with context from your conversation

### Deep Linking Examples

**Ride Booking:**
- Chat: "I need an Uber to SoFi Stadium"
- Result: Opens Uber app with destination pre-filled

**Restaurant Search:**
- Chat: "Find Mexican restaurants near the stadium"
- Result: Opens Yelp with cuisine and location

**Translation:**
- Chat: "Translate 'thank you' to Spanish"
- Result: Opens Google Translate with text pre-filled

---

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── ChatInterface.tsx      # Main chat UI with voice
│   ├── Dashboard.tsx           # Landing page with quick actions
│   ├── QuickActions/           # Quick action components
│   ├── VenueMap.tsx           # Stadium locations map
│   └── MatchCard.tsx          # Match information cards
├── services/
│   ├── chatApi.ts             # Backend API integration
│   ├── intentDetector.ts      # Intent recognition engine
│   ├── deepLinkService.ts     # Deep linking logic
│   └── venueService.ts        # Stadium data service
└── hooks/
    └── useVoiceInput.ts       # Voice recognition hook
```

### Backend (Express + Groq)
```
server/
├── testServer.js              # Main server with Groq integration
├── groqServer.js              # Alternative server implementation
└── test-*.js                  # Testing utilities
```

### Key Technologies
- **Frontend**: React 19.2.0, TypeScript 4.9.5, Tailwind CSS
- **Backend**: Express 4.21.2, Groq SDK 0.11.0
- **Voice**: Deepgram SDK, Web Speech API
- **Build**: Create React App, Node.js 16+

---

## 💡 Features Deep Dive

### Intent Detection System
The application uses a sophisticated regex-based intent detection system that analyzes user messages to determine the desired action:

```typescript
// Detects various intent types from natural language
detectIntent(message: string): IntentResult {
  // Checks for ride booking keywords
  // Extracts addresses and destinations
  // Identifies restaurant preferences
  // Recognizes translation requests
  // etc.
}
```

**Supported Intents:**
1. **Ride** - Transportation requests
2. **Restaurant** - Dining and food search
3. **Place** - Points of interest
4. **Translate** - Language translation
5. **Tickets** - Match tickets and access
6. **Navigate** - Directions and routing

### Context Extraction
The system extracts relevant context from conversations:
- **Addresses** - Street addresses, stadiums, landmarks
- **Cuisine Types** - Italian, Mexican, American, etc.
- **Place Names** - Tourist attractions, hotels, venues
- **Languages** - Source and target for translation
- **Match Information** - Teams, dates, venues

### Deep Link Generation
Platform-aware URL generation for seamless app integration:

```typescript
// Mobile detection
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

// Platform-specific URLs
const uberUrl = isMobile 
  ? `uber://...`  // Native app
  : `https://m.uber.com/...`;  // Web fallback
```

---

## 📊 Venue Coverage

The application provides comprehensive information for all 16 FIFA 2026 venues:

### United States 🇺🇸
- **SoFi Stadium** - Los Angeles, CA (70,240 capacity)
- **MetLife Stadium** - East Rutherford, NJ (82,500)
- **AT&T Stadium** - Arlington, TX (80,000)
- **Mercedes-Benz Stadium** - Atlanta, GA (71,000)
- **NRG Stadium** - Houston, TX (72,220)
- **Arrowhead Stadium** - Kansas City, MO (76,416)
- **Hard Rock Stadium** - Miami Gardens, FL (64,767)
- **Lincoln Financial Field** - Philadelphia, PA (69,596)
- **Levi's Stadium** - Santa Clara, CA (68,500)
- **Gillette Stadium** - Foxborough, MA (65,878)
- **Lumen Field** - Seattle, WA (68,740)

### Mexico 🇲🇽
- **Estadio Azteca** - Mexico City (87,523)
- **Estadio BBVA** - Monterrey (53,500)
- **Estadio Akron** - Guadalajara (46,232)

### Canada 🇨🇦
- **BMO Field** - Toronto (30,000)
- **BC Place** - Vancouver (54,500)

---

## 📚 Documentation

Comprehensive guides available in the repository:

- **[CONTEXT_AWARE_DEEP_LINKING.md](CONTEXT_AWARE_DEEP_LINKING.md)** - Deep linking implementation details
- **[GROQ_SETUP.md](GROQ_SETUP.md)** - Complete Groq AI setup guide
- **[QUICK_ACTIONS_USER_GUIDE.md](QUICK_ACTIONS_USER_GUIDE.md)** - User guide for quick actions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment options
- **[AWS_SETUP_GUIDE.md](AWS_SETUP_GUIDE.md)** - AWS deployment instructions

---

## 🔧 API Reference

### Backend Endpoints

#### Health Check
```http
GET /health
```
Returns server status and API key validation.

**Response:**
```json
{
  "status": "ok",
  "groqConfigured": true,
  "timestamp": "2025-10-18T12:00:00.000Z"
}
```

#### Chat Completion
```http
POST /api/chat
Content-Type: application/json

{
  "message": "When is the USA vs Mexico match?",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "The USA vs Mexico match is scheduled for...",
  "model": "llama-3.3-70b-versatile",
  "tokens": 150
}
```

### Frontend Services

#### Intent Detector
```typescript
import { detectIntent } from './services/intentDetector';

const result = detectIntent("I need a ride to SoFi Stadium");
// Returns: { type: 'ride', address: 'SoFi Stadium, Los Angeles, CA' }
```

#### Deep Link Service
```typescript
import DeepLinkService from './services/deepLinkService';

// Open Uber with destination
DeepLinkService.openRideBooking('SoFi Stadium');

// Search restaurants
DeepLinkService.openYelp('Italian', 'Los Angeles');

// Navigate to venue
DeepLinkService.openNavigation('MetLife Stadium');
```

---

## 💰 Cost & Pricing

### Free Tier Benefits

| Service | Free Tier | Cost | Limits |
|---------|-----------|------|--------|
| **Groq AI** | ✅ Yes | $0.00 | 14,400 requests/day |
| **Deepgram Voice** | ✅ Yes | $0.00 | 45,000 minutes/month |
| **Development** | ✅ Free | $0.00 | Unlimited local testing |
| **Total Monthly** | - | **$0.00** | Perfect for personal use |

### No Credit Card Required!
- Groq AI provides instant API access
- Deepgram offers generous free tier
- All development and testing is free
- Production deployment optional

---

## 🆘 Troubleshooting

### Common Issues

#### Voice Recognition Not Working
**Problem:** Microphone button doesn't respond
**Solutions:**
- Check browser microphone permissions
- Use HTTPS or localhost (required for Web Speech API)
- Try Chrome or Edge browsers (best support)
- Verify Deepgram API key in `.env`

#### AI Chat Not Responding
**Problem:** Messages sent but no response
**Solutions:**
- Verify backend server is running on port 3002
- Check `GROQ_API_KEY` is set in `.env`
- Visit http://localhost:3002/health to test
- Check console for error messages
- Ensure no firewall blocking localhost

#### Deep Links Not Opening
**Problem:** Links don't open apps on mobile
**Solutions:**
- Verify app is installed (Uber, Google Maps, etc.)
- Check browser allows pop-ups
- Try Safari on iOS, Chrome on Android
- Fall back to web version if app unavailable

#### Port Already in Use
**Problem:** Cannot start server - port 3001 or 3002 in use
**Solutions:**
```bash
# Windows - Kill process on port
netstat -ano | findstr :3002
taskkill /PID <process_id> /F

# Or change ports in package.json and server/testServer.js
```

#### Dependencies Installation Failed
**Problem:** `npm install` errors
**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

### Getting Help
- Check [Issues](https://github.com/Mohith1/aws-agentic-hackathon-lax/issues) for similar problems
- Review server logs in terminal
- Enable debug mode in `.env`:
  ```
  DEBUG=true
  LOG_LEVEL=verbose
  ```

---

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Manual Testing

**Intent Detection:**
```bash
node scripts/test-ride-intent.js
```

**Groq API:**
```bash
node server/test-groq-key.js
```

**Voice Recognition:**
- Navigate to chat interface
- Click microphone icon
- Speak test phrase
- Verify transcription accuracy

---

## 🚀 Deployment

### Development
Already running locally at:
- Frontend: http://localhost:3001
- Backend: http://localhost:3002

### Production Options

#### 1. AWS Amplify (Frontend)
```bash
# Build production bundle
npm run build

# Deploy to AWS Amplify
# Follow AWS_SETUP_GUIDE.md for details
```

#### 2. AWS Lambda (Backend)
```bash
# Deploy serverless backend
cd pulumi
pulumi up

# See DEPLOYMENT.md for complete guide
```

#### 3. Docker Deployment
```bash
# Build Docker image
docker build -t fifa-concierge .

# Run container
docker run -p 3001:3001 -p 3002:3002 fifa-concierge
```

#### 4. Vercel/Netlify (Static)
- Connect GitHub repository
- Configure build settings
- Deploy automatically on push

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m "feat: Add amazing feature"
   ```
5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** - For providing free, blazing-fast LLM inference
- **Deepgram** - For accurate voice-to-text transcription
- **FIFA** - For inspiring this World Cup 2026 project
- **React Team** - For the amazing framework
- **Open Source Community** - For countless libraries and tools

---

## 📞 Contact & Support

- **Repository:** [aws-agentic-hackathon-lax](https://github.com/Mohith1/aws-agentic-hackathon-lax)
- **Issues:** [GitHub Issues](https://github.com/Mohith1/aws-agentic-hackathon-lax/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Mohith1/aws-agentic-hackathon-lax/discussions)

---

## 🗺️ Roadmap

### Planned Features
- [ ] Multi-language support (Spanish, French, Arabic)
- [ ] Real-time match updates and scores
- [ ] Push notifications for match start times
- [ ] Offline mode for essential features
- [ ] Social sharing of match experiences
- [ ] Integration with hotel booking services
- [ ] Weather forecasts for match days
- [ ] Public transportation integration
- [ ] Accessibility improvements (screen reader support)
- [ ] Progressive Web App (PWA) capabilities

### Future Enhancements
- [ ] Mobile native apps (iOS/Android)
- [ ] Apple Watch / Wear OS companion apps
- [ ] AR wayfinding in stadiums
- [ ] Integration with official FIFA app
- [ ] Fan community features
- [ ] Match prediction games
- [ ] Virtual stadium tours

---

## 📸 Screenshots

### Chat Interface
*AI-powered chat with voice recognition and context-aware responses*

### Dashboard
*Quick access to rides, restaurants, tickets, and navigation*

### Venue Map
*Interactive map of all 16 FIFA 2026 stadiums*

---

## 🎯 Project Goals

This project was created for the **AWS Agentic Hackathon** with the following objectives:

1. **Enhance Fan Experience** - Make attending FIFA 2026 matches easier and more enjoyable
2. **Leverage AI** - Demonstrate practical AI applications in event management
3. **Zero Cost Solution** - Prove that powerful AI tools don't require expensive infrastructure
4. **Open Source** - Contribute to the developer community with reusable components
5. **Accessibility** - Ensure the app is usable by fans of all technical levels

---

**Built with ❤️ for FIFA World Cup 2026**

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
