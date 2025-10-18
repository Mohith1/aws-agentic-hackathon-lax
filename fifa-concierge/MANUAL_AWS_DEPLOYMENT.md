# Manual AWS Deployment Guide (No Pulumi Required)

If you prefer not to install Pulumi, you can deploy the infrastructure manually through AWS Console.

## Prerequisites

1. ✅ **AWS Account** with console access
2. ✅ **Deepgram API Key** (You already have: `c4c9ff37351f23ad9369b50484b12bc8ada9d526`)
3. ✅ **AWS CLI** configured (or use AWS Console)

---

## Step 1: Enable AWS Bedrock Model Access

1. **Go to AWS Bedrock Console**
   - URL: https://console.aws.amazon.com/bedrock/
   - Region: **us-east-1** (N. Virginia)

2. **Request Model Access**
   - Click **"Model access"** in left sidebar
   - Find **"Anthropic - Claude 3.5 Sonnet v2"**
   - Click **"Request model access"** or **"Enable"**
   - Wait for approval (usually instant)

---

## Step 2: Create Lambda Function

1. **Go to AWS Lambda Console**
   - URL: https://console.aws.amazon.com/lambda/
   - Region: **us-east-1**

2. **Create Function**
   - Click **"Create function"**
   - Choose **"Author from scratch"**
   - Function name: `fifa-chat-handler`
   - Runtime: **Python 3.11** or **Python 3.12**
   - Architecture: **x86_64**
   - Click **"Create function"**

3. **Add Function Code**
   - In the Code source section, paste the code from `lambda-handler.py`
   - Click **"Deploy"**

4. **Configure Function Settings**
   - Go to **Configuration** → **General configuration**
   - Timeout: **30 seconds**
   - Memory: **512 MB**
   - Click **"Save"**

5. **Add Environment Variables** (Optional)
   - Go to **Configuration** → **Environment variables**
   - Add: `CONVERSATION_TABLE` = `fifa-conversations` (if you create DynamoDB table)

6. **Add IAM Permissions**
   - Go to **Configuration** → **Permissions**
   - Click on the execution role name
   - Click **"Add permissions"** → **"Attach policies"**
   - Add these policies:
     - `AWSLambdaBasicExecutionRole` (already attached)
     - Create inline policy for Bedrock:
       ```json
       {
         "Version": "2012-10-17",
         "Statement": [
           {
             "Effect": "Allow",
             "Action": [
               "bedrock:InvokeModel",
               "bedrock:InvokeModelWithResponseStream"
             ],
             "Resource": "*"
           }
         ]
       }
       ```

---

## Step 3: Create API Gateway

1. **Go to API Gateway Console**
   - URL: https://console.aws.amazon.com/apigateway/
   - Region: **us-east-1**

2. **Create HTTP API**
   - Click **"Create API"**
   - Choose **"HTTP API"** → Click **"Build"**
   - API name: `fifa-concierge-api`
   - Click **"Next"**

3. **Configure Routes**
   - Click **"Add integration"**
   - Integration type: **Lambda function**
   - Select: `fifa-chat-handler`
   - Method: **POST**
   - Resource path: `/chat`
   - Click **"Next"**

4. **Configure CORS**
   - Access-Control-Allow-Origin: `*`
   - Access-Control-Allow-Methods: `POST, OPTIONS`
   - Access-Control-Allow-Headers: `Content-Type, Authorization`
   - Click **"Next"**

5. **Create & Deploy**
   - Stage name: `$default` (auto-deploy enabled)
   - Click **"Create"**

6. **Copy API Endpoint**
   - After creation, you'll see the **Invoke URL**
   - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com`
   - **Save this URL** - you'll need it!

---

## Step 4: Update Frontend Configuration

1. **Update `.env` file**
   ```env
   REACT_APP_API_ENDPOINT=https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com
   ```
   Replace `YOUR-API-ID` with the actual API Gateway URL

2. **Restart frontend**
   ```bash
   # Stop current server (Ctrl+C in the terminal)
   npm start
   ```

---

## Step 5: Test the Integration

### Test Lambda Directly

1. **In Lambda Console**
   - Go to your `fifa-chat-handler` function
   - Click **"Test"** tab
   - Create test event:
     ```json
     {
       "body": "{\"message\":\"When is USA vs Mexico playing?\",\"conversationHistory\":[],\"userId\":\"test-user\"}"
     }
     ```
   - Click **"Test"**
   - Verify you get a response from Claude

### Test API Gateway

1. **Using curl** (PowerShell):
   ```powershell
   $body = @{
       message = "When is USA vs Mexico playing?"
       conversationHistory = @()
       userId = "test-user"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/chat" -Method POST -Body $body -ContentType "application/json"
   ```

2. **Using Postman or Browser**
   - POST to: `https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/chat`
   - Body (JSON):
     ```json
     {
       "message": "Hello",
       "conversationHistory": [],
       "userId": "test"
     }
     ```

### Test Frontend

1. **Open chat page**
   - URL: http://localhost:3001/chat

2. **Try text message**
   - Type: "When is USA vs Mexico playing?"
   - Press Enter
   - Should get AI response

3. **Try voice input**
   - Click microphone button
   - Speak clearly
   - Should see transcript and get AI response

---

## Step 6: Optional - Create DynamoDB Table

If you want to store conversation history:

1. **Go to DynamoDB Console**
   - URL: https://console.aws.amazon.com/dynamodb/

2. **Create Table**
   - Table name: `fifa-conversations`
   - Partition key: `userId` (String)
   - Sort key: `timestamp` (Number)
   - Table settings: **On-demand**
   - Click **"Create table"**

3. **Update Lambda IAM Role**
   - Add DynamoDB permissions to Lambda execution role:
     ```json
     {
       "Effect": "Allow",
       "Action": [
         "dynamodb:PutItem",
         "dynamodb:GetItem",
         "dynamodb:Query"
       ],
       "Resource": "arn:aws:dynamodb:us-east-1:YOUR-ACCOUNT-ID:table/fifa-conversations"
     }
     ```

---

## Troubleshooting

### Lambda Errors
- Check **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/
- Look for `/aws/lambda/fifa-chat-handler` log group
- Check for permission errors or Bedrock access issues

### API Gateway Errors
- Verify Lambda integration is configured correctly
- Check CORS settings
- Test Lambda directly first before testing via API Gateway

### Frontend Not Connecting
- Verify API endpoint in `.env` is correct
- Check browser console for errors
- Ensure API Gateway returns proper CORS headers

---

## What You Need to Provide

After completing the manual setup:

1. ✅ **API Gateway Endpoint**
   - Format: `https://xxxxx.execute-api.us-east-1.amazonaws.com`
   - Update in `.env` as `REACT_APP_API_ENDPOINT`

2. ✅ **Verify Bedrock Access**
   - Confirm Claude 3.5 Sonnet v2 is enabled in your account

---

## Cost Estimate

- **Lambda**: ~$0.20 per 1M requests + compute time
- **API Gateway**: $1.00 per million requests
- **Bedrock Claude 3.5 Sonnet**: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- **DynamoDB**: Free tier (25 GB storage, 25 WCU, 25 RCU)

**Estimated cost for hackathon**: < $5 for moderate testing

---

## Summary

Once you complete the manual setup:
1. Lambda function with Bedrock integration ✅
2. API Gateway HTTP API with CORS ✅
3. Frontend configured with API endpoint ✅
4. Voice + AI chat fully functional ✅

No Pulumi installation required!
