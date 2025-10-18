# Voice & AWS Bedrock Integration - Complete ✅

## What's Been Implemented

### 1. ✅ Deepgram Voice-to-Text Service
- **File**: `src/services/deepgramService.ts`
- **Features**:
  - Real-time streaming transcription using Deepgram SDK
  - Interim results (live transcription preview)
  - Final results (confirmed text)
  - Error handling and microphone permission management
  - Singleton pattern for efficient resource usage

### 2. ✅ AWS Bedrock Chat API Client
- **File**: `src/services/chatApi.ts`
- **Features**:
  - Axios-based HTTP client
  - Communicates with API Gateway endpoint
  - Sends conversation history for context
  - Error handling with user-friendly messages
  - Health check endpoint

### 3. ✅ Updated Chat Interface
- **File**: `src/components/ChatInterface.tsx`
- **New Features**:
  - Real voice input with Deepgram
  - Live interim transcript display (shows what you're saying in real-time)
  - Connection to AWS Bedrock Agent via API Gateway
  - Error alerts with clear messaging
  - Loading states and UX improvements

### 4. ✅ Environment Configuration
- **File**: `.env`
- **Required Variables**:
  ```env
  PORT=3001
  REACT_APP_DEEPGRAM_API_KEY=your-deepgram-api-key-here
  REACT_APP_API_ENDPOINT=your-api-gateway-endpoint-here
  REACT_APP_ENABLE_VOICE=true
  ```

### 5. ✅ AWS Infrastructure (Already in Pulumi)
- **File**: `pulumi/index.ts`
- **Resources**:
  - Lambda function with Bedrock integration
  - API Gateway HTTP API with CORS
  - DynamoDB tables for conversations
  - IAM roles and policies
  - EventBridge for scheduled updates

## What You Need to Provide

### 1. **Deepgram API Key** 🎤
   - **Where to get it**: https://console.deepgram.com/signup
   - **Steps**:
     1. Sign up for free account
     2. Go to "API Keys" section
     3. Create new API key named "FIFA-Concierge-Voice"
     4. Copy the key
   - **Add to**: `.env` file as `REACT_APP_DEEPGRAM_API_KEY`

### 2. **API Gateway Endpoint** 🌐
   - **How to get it**: Deploy Pulumi stack
   - **Steps**:
     ```bash
     cd pulumi
     npm install
     pulumi up
     ```
   - **Look for output**: `apiEndpoint: "https://xxxxx.execute-api.us-east-1.amazonaws.com"`
   - **Add to**: `.env` file as `REACT_APP_API_ENDPOINT`

### 3. **AWS Bedrock Model Access** 🤖
   - **Where**: AWS Bedrock Console → Model Access
   - **Model needed**: Claude 3.5 Sonnet v2 (anthropic.claude-3-5-sonnet-20241022-v2:0)
   - **Region**: us-east-1 (recommended)
   - **Steps**:
     1. Go to https://console.aws.amazon.com/bedrock/
     2. Click "Model access" in sidebar
     3. Request access to Claude 3.5 Sonnet v2
     4. Wait for approval (usually instant)

## How to Test

### Step 1: Configure Environment
```bash
# Edit .env file with your values
REACT_APP_DEEPGRAM_API_KEY=<your-deepgram-key>
REACT_APP_API_ENDPOINT=<your-api-gateway-url>
```

### Step 2: Deploy Backend (if not done)
```bash
cd pulumi
npm install
pulumi up
# Copy the apiEndpoint from output
```

### Step 3: Start Frontend
```bash
cd ..
npm start
# Opens http://localhost:3001
```

### Step 4: Test Chat
1. Navigate to http://localhost:3001/chat
2. **Test Text Input**:
   - Type: "When is USA vs Mexico playing?"
   - Press Enter or click Send
   - Should get response from AWS Bedrock

3. **Test Voice Input**:
   - Click microphone button (turns red when active)
   - Speak: "Show me nearby restaurants"
   - See interim transcript appear in blue box
   - Microphone stops automatically or click again to stop
   - Final transcript appears in input box
   - Click Send or press Enter

## Architecture Flow

```
User speaks → Microphone 
    ↓
Deepgram Service (streaming transcription)
    ↓
Text appears in input → User sends
    ↓
ChatInterface → chatApi.sendMessage()
    ↓
API Gateway (HTTPS POST /chat)
    ↓
Lambda Function (fifa-chat-handler)
    ↓
AWS Bedrock (Claude 3.5 Sonnet v2)
    ↓
Response → Lambda → API Gateway
    ↓
Frontend displays AI response
```

## Troubleshooting

### Voice Not Working?
- ✅ Check: Deepgram API key in `.env`
- ✅ Check: Browser microphone permissions
- ✅ Check: Browser console for errors
- ✅ Note: HTTPS required in production (localhost OK for dev)

### Chat Not Responding?
- ✅ Check: API endpoint in `.env`
- ✅ Check: Pulumi stack deployed successfully
- ✅ Check: Lambda logs in CloudWatch
- ✅ Check: Bedrock model access granted
- ✅ Check: Network tab for API errors

### Backend Errors?
- ✅ Check: Lambda has correct IAM permissions
- ✅ Check: Environment variables set in Lambda
- ✅ Check: DynamoDB tables exist
- ✅ Check: CORS configured in API Gateway

## Testing Commands

### Test API Gateway directly
```bash
curl -X POST https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "conversationHistory": [],
    "userId": "test-user"
  }'
```

### Test Lambda directly
```bash
aws lambda invoke \
  --function-name fifa-chat-handler-XXXXX \
  --payload '{"body":"{\"message\":\"Hello\",\"conversationHistory\":[],\"userId\":\"test\"}"}' \
  response.json
```

### Check Lambda logs
```bash
aws logs tail /aws/lambda/fifa-chat-handler-XXXXX --follow
```

## Next Steps After Setup

1. ✅ Test voice input thoroughly
2. ✅ Test AI responses from Bedrock
3. ✅ Add user authentication (Cognito)
4. ✅ Enhance prompts with more context
5. ✅ Add action groups for bookings
6. ✅ Monitor usage and costs

## Files Modified/Created

- ✅ `src/services/deepgramService.ts` - NEW
- ✅ `src/services/chatApi.ts` - NEW
- ✅ `src/components/ChatInterface.tsx` - UPDATED
- ✅ `.env` - UPDATED
- ✅ `AWS_SETUP_GUIDE.md` - NEW
- ✅ `pulumi/index.ts` - EXISTING (already has Bedrock integration)

## Quick Reference: What I Need From You

### Right Now:
1. **Deepgram API Key** 
   - Get from: https://console.deepgram.com/
   - Add to `.env`: `REACT_APP_DEEPGRAM_API_KEY=xxxxx`

2. **Deploy Pulumi & Get API Endpoint**
   ```bash
   cd pulumi
   pulumi up
   # Copy apiEndpoint from output
   ```
   - Add to `.env`: `REACT_APP_API_ENDPOINT=https://xxxxx.execute-api.us-east-1.amazonaws.com`

3. **Bedrock Access**
   - Console: https://console.aws.amazon.com/bedrock/
   - Request access to: Claude 3.5 Sonnet v2

### After Setup:
- Test at http://localhost:3001/chat
- Let me know if you hit any errors!

---

**Status**: ✅ Code implementation complete. Waiting for API keys and deployment.
