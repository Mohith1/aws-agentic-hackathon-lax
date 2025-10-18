# 🏆 FIFA World Cup 2026 AI Concierge - Complete Documentation

> An intelligent AI-powered assistant helping international visitors navigate the FIFA World Cup 2026 experience in Los Angeles.

![FIFA 2026](https://img.shields.io/badge/FIFA-2026-blue)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![Deepgram](https://img.shields.io/badge/Deepgram-Voice-green)

## 🌟 Features

### Core Functionality
- **🤖 AI Conversational Interface**: Powered by Amazon Bedrock (Claude 4.5)
- **🎤 Voice Input**: Real-time speech-to-text with Deepgram
- **🗺️ Interactive Venue Maps**: Leaflet-based navigation with stadium locations
- **📅 Personalized Dashboard**: Match schedules, recommendations, and quick actions
- **🌍 Multi-language Support**: Real-time translation capabilities
- **🔔 Proactive Notifications**: Match alerts, traffic updates, weather warnings
- **🚗 Transportation Integration**: Route planning and booking assistance

### Innovation Highlights
- Context-aware AI responses with conversation memory
- Personalized recommendations based on user preferences
- Real-time data aggregation from multiple sources
- Secure secrets management with Akeyless
- Infrastructure as Code with Pulumi

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **AWS Account** with appropriate permissions
- **Pulumi CLI** installed (optional, for infrastructure deployment)
- **Deepgram API Key** (for voice features)
- **Akeyless Account** (for secrets management)

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
fifa-concierge/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ChatInterface.tsx    # AI chat component
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── VenueMap.tsx         # Interactive map
│   ├── hooks/            # Custom React hooks
│   │   └── useVoiceInput.ts     # Deepgram integration
│   ├── App.tsx           # Main app with routing
│   └── index.tsx         # Entry point
├── pulumi/               # Infrastructure as Code
│   ├── index.ts          # AWS resources definition
│   ├── package.json
│   └── Pulumi.yaml
├── .env.example          # Environment template
├── package.json
└── README.md
```

## 🎨 UI/UX Design

### Color Palette
- **Primary (FIFA Blue)**: `#0066B2`
- **Secondary (FIFA Gold)**: `#B4975A`
- **Accent (FIFA Green)**: `#00A651`

### Key Pages
1. **Dashboard** (`/`) - Personalized match overview
2. **AI Chat** (`/chat`) - Conversational assistant
3. **Venue Map** (`/map`) - Interactive stadium map
4. **Profile** (`/profile`) - User preferences

## 📊 AWS Services Used

- ✅ **Amazon Bedrock** - Claude 4.5 for conversational AI
- ✅ **AWS Lambda** - Serverless functions
- ✅ **API Gateway** - HTTP API endpoints
- ✅ **DynamoDB** - NoSQL database
- ✅ **EventBridge** - Event-driven architecture
- ✅ **SNS** - Push notifications

## 🔌 Partner Integrations

- **Deepgram**: Real-time speech-to-text
- **Akeyless**: Secure secrets management
- **Pulumi**: Infrastructure as Code

## 🎯 Demo Script

1. **Natural Language Chat**: "When is USA vs Mexico playing?"
2. **Voice Input**: Hands-free interaction
3. **Smart Routing**: "Get me to SoFi Stadium"
4. **Personalized Recommendations**: Restaurant suggestions

---

**Built with ❤️ for FIFA World Cup 2026**
