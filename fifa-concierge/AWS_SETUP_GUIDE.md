# AWS Bedrock Agent Setup Guide

This guide will walk you through setting up the AWS Bedrock Agent for the FIFA World Cup 2026 AI Concierge.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with your credentials
3. **Pulumi CLI** installed
4. **Deepgram Account** (for voice-to-text)

## Step 1: Configure AWS Bedrock Agent

### Option A: Create Bedrock Agent via AWS Console

1. **Navigate to Amazon Bedrock Console**
   - Go to: https://console.aws.amazon.com/bedrock/
   - Select your region (recommend: `us-east-1`)

2. **Request Model Access**
   - Click "Model access" in left sidebar
   - Request access to: **Claude 3.5 Sonnet v2** (anthropic.claude-3-5-sonnet-20241022-v2:0)
   - Wait for approval (usually instant for most accounts)

3. **Create a Bedrock Agent (Optional - Enhanced Features)**
   
   If you want to use Bedrock Agents with action groups:
   
   a. Navigate to "Agents" in Bedrock console
   b. Click "Create Agent"
   c. Configure:
      - **Agent name**: FIFA-2026-Concierge
      - **Description**: AI Concierge for FIFA World Cup 2026 attendees
      - **Model**: Claude 3.5 Sonnet v2
      
   d. Add Instructions:
   ```
   You are an AI concierge for FIFA World Cup 2026 in Los Angeles, USA.
   
   Your role is to assist international visitors with:
   - Match schedules, scores, and venue information
   - Transportation options (metro, rideshare, parking)
   - Restaurant recommendations near stadiums
   - Hotel and accommodation suggestions
   - Real-time language translation
   - Local attractions and fan zones
   - Weather updates
   - Booking assistance
   
   Always be friendly, helpful, and provide specific actionable advice.
   Use emojis to make responses engaging.
   Consider the user's location, language preferences, and schedule.
   ```
   
   e. (Optional) Add Action Groups for:
      - Match data lookup (DynamoDB)
      - Restaurant search (external API)
      - Translation services (Amazon Translate)
   
   f. Create and note the **Agent ID** and **Agent Alias ID**

### Option B: Use Direct Bedrock Model (Current Setup)

Our current Lambda function uses direct Bedrock model invocation. No additional Bedrock Agent setup needed.

## Step 2: Get Deepgram API Key

1. **Sign up for Deepgram**
   - Go to: https://console.deepgram.com/signup
   - Create a free account

2. **Create API Key**
   - Navigate to "API Keys" section
   - Click "Create a New API Key"
   - Name: `FIFA-Concierge-Voice`
   - Copy the API key (starts with something like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

3. **Update .env file**
   ```bash
   REACT_APP_DEEPGRAM_API_KEY=your-deepgram-api-key-here
   ```

## Step 3: Deploy AWS Infrastructure with Pulumi

1. **Navigate to Pulumi directory**
   ```bash
   cd pulumi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Pulumi**
   ```bash
   # Login to Pulumi (use local state or Pulumi Cloud)
   pulumi login --local
   # or
   pulumi login
   
   # Set AWS region
   pulumi config set aws:region us-east-1
   ```

4. **Deploy the stack**
   ```bash
   pulumi up
   ```
   
   Review the changes and confirm with "yes"

5. **Capture the outputs**
   
   After deployment, Pulumi will output important values:
   
   ```
   Outputs:
     apiEndpoint              : "https://abc123xyz.execute-api.us-east-1.amazonaws.com"
     chatLambdaArn           : "arn:aws:lambda:us-east-1:123456789012:function:fifa-chat-handler-xyz"
     conversationTableName    : "fifa-conversations-xyz"
     matchDataTableName       : "fifa-match-data-xyz"
     notificationTopicArn     : "arn:aws:sns:us-east-1:123456789012:fifa-notifications"
     userProfileTableName     : "fifa-user-profiles-xyz"
   ```

6. **Copy the API Endpoint**
   
   Update your `.env` file:
   ```bash
   REACT_APP_API_ENDPOINT=https://abc123xyz.execute-api.us-east-1.amazonaws.com
   ```

## Step 4: Test the Lambda Function

1. **Test via AWS Console**
   - Go to Lambda console
   - Find function: `fifa-chat-handler-*`
   - Click "Test" tab
   - Create test event:
   ```json
   {
     "body": "{\"message\":\"When is USA vs Mexico playing?\",\"conversationHistory\":[],\"userId\":\"test-user\"}"
   }
   ```
   - Click "Test" and verify response

2. **Test via curl**
   ```bash
   curl -X POST https://your-api-endpoint.execute-api.us-east-1.amazonaws.com/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "When is USA vs Mexico playing?",
       "conversationHistory": [],
       "userId": "test-user"
     }'
   ```

## Step 5: Configure Frontend

1. **Update .env with all values**
   ```bash
   PORT=3001
   AWS_REGION=us-east-1
   AWS_ACCOUNT_ID=123456789012
   REACT_APP_DEEPGRAM_API_KEY=your-deepgram-api-key
   REACT_APP_API_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com
   REACT_APP_ENABLE_VOICE=true
   ```

2. **Restart development server**
   ```bash
   npm start
   ```

3. **Test the chat interface**
   - Navigate to: http://localhost:3001/chat
   - Try text input
   - Try voice input (click microphone icon)

## Step 6: Enhanced Bedrock Agent Integration (Optional)

If you created a Bedrock Agent in Step 1, update the Lambda function:

1. **Modify `pulumi/index.ts`** to use Bedrock Agent Runtime:

```typescript
const { BedrockAgentRuntimeClient, InvokeAgentCommand } = require("@aws-sdk/client-bedrock-agent-runtime");

const bedrockAgent = new BedrockAgentRuntimeClient({ region: "us-east-1" });

// Replace the InvokeModelCommand with:
const response = await bedrockAgent.send(new InvokeAgentCommand({
  agentId: process.env.BEDROCK_AGENT_ID,
  agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
  sessionId: userId,
  inputText: message
}));
```

2. **Redeploy**
   ```bash
   cd pulumi
   pulumi up
   ```

## Troubleshooting

### Voice Not Working
- Check Deepgram API key is correct
- Verify browser microphone permissions
- Check browser console for errors
- Ensure HTTPS (required for microphone access in production)

### API Not Responding
- Verify API Gateway endpoint is correct
- Check Lambda CloudWatch logs for errors
- Ensure Bedrock model access is granted
- Verify CORS is configured correctly

### Bedrock Access Denied
- Check IAM role has `bedrock:InvokeModel` permission
- Verify model access is granted in Bedrock console
- Confirm using correct model ID

## Production Considerations

1. **Security**
   - Add authentication (AWS Cognito)
   - Use AWS WAF for API Gateway
   - Rotate API keys regularly
   - Use AWS Secrets Manager for sensitive data

2. **Cost Optimization**
   - Set Lambda reserved concurrency
   - Use DynamoDB on-demand billing
   - Monitor Bedrock token usage
   - Set CloudWatch log retention

3. **Monitoring**
   - Set up CloudWatch alarms
   - Enable X-Ray tracing
   - Monitor API Gateway metrics
   - Track Deepgram usage

## What You Need to Provide

Please provide the following information after completing the steps:

1. ✅ **Deepgram API Key** → Add to `.env` as `REACT_APP_DEEPGRAM_API_KEY`
2. ✅ **API Gateway Endpoint** → Will be output from `pulumi up` → Add to `.env` as `REACT_APP_API_ENDPOINT`
3. ⚠️ **AWS Account ID** (optional) → For reference
4. ⚠️ **Bedrock Agent ID** (optional) → If using Bedrock Agents instead of direct model

## Quick Start Checklist

- [ ] Request Bedrock model access (Claude 3.5 Sonnet v2)
- [ ] Create Deepgram account and get API key
- [ ] Run `cd pulumi && npm install`
- [ ] Run `pulumi up` and note the API endpoint
- [ ] Update `.env` with Deepgram key and API endpoint
- [ ] Restart frontend: `npm start`
- [ ] Test at http://localhost:3001/chat

---

**Need Help?** Check the AWS Bedrock documentation:
- Bedrock User Guide: https://docs.aws.amazon.com/bedrock/
- Deepgram API Docs: https://developers.deepgram.com/
