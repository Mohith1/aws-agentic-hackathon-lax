# 🚀 Choose Your Deployment Method

You have **3 options** to deploy the AWS infrastructure:

---

## ⚡ Option 1: Install Pulumi CLI (Recommended for Infrastructure as Code)

**Pros:**
- ✅ Automated deployment
- ✅ Easy to update/destroy resources
- ✅ Version controlled infrastructure
- ✅ Best for production

**Steps:**

### Windows PowerShell (Run as Administrator):
```powershell
# Install Pulumi
iex ((New-Object System.Net.WebClient).DownloadString('https://get.pulumi.com/install.ps1'))

# Close and reopen PowerShell, then:
cd pulumi
npm install
pulumi login --local
pulumi up
```

**Time:** 5 minutes

---

## 🎯 Option 2: Manual AWS Console Deployment (No Installation Needed)

**Pros:**
- ✅ No tools to install
- ✅ Full control via GUI
- ✅ Good for learning AWS services
- ✅ Works immediately

**Steps:**
Follow the guide: **`MANUAL_AWS_DEPLOYMENT.md`**

1. Enable Bedrock model access (Claude 3.5 Sonnet v2)
2. Create Lambda function (copy code from `lambda-handler.py`)
3. Create API Gateway HTTP API
4. Configure CORS
5. Copy API endpoint to `.env`

**Time:** 15-20 minutes

---

## 🔥 Option 3: Quick Test with Mock Backend (Skip AWS for Now)

**Pros:**
- ✅ Test voice immediately
- ✅ No AWS setup needed
- ✅ Focus on frontend first

**Steps:**

I can create a local mock API server that simulates AWS Bedrock responses. This lets you test the voice-to-text and UI flow without AWS setup.

```bash
# I'll create a simple Express server that mocks the API
npm install express cors
node mock-server.js
```

Then test at http://localhost:3001/chat

**Time:** 2 minutes

---

## 🎯 My Recommendation

### For Hackathon/Demo:
**Choose Option 2** (Manual AWS Console) 
- No installation hassles
- Quick to set up
- Full AWS Bedrock integration
- Copy/paste the Lambda code I provided

### For Production/Long-term:
**Choose Option 1** (Pulumi)
- Better for managing infrastructure
- Easy to replicate in other environments

### For Quick Testing First:
**Choose Option 3** (Mock Backend)
- Test voice input immediately
- Set up AWS later

---

## What Do You Want to Do?

**Option A:** Install Pulumi and deploy with IaC
- Run: `install-pulumi.ps1` (I created this script)

**Option B:** Deploy manually via AWS Console
- Follow: `MANUAL_AWS_DEPLOYMENT.md`
- Use Lambda code: `lambda-handler.py`

**Option C:** Create mock server for testing
- Let me know and I'll create it now

---

## Current Status

✅ **Deepgram API Key**: Added to `.env`  
✅ **Frontend Code**: Complete with voice + AI chat  
✅ **Lambda Code**: Ready in `lambda-handler.py`  
⏳ **AWS Deployment**: Waiting for your choice  

---

## Quick Commands Reference

### If you choose Pulumi (Option 1):
```powershell
# Install Pulumi
.\install-pulumi.ps1

# Deploy
cd pulumi
npm install
pulumi login --local
pulumi up
```

### If you choose Manual (Option 2):
1. Open `MANUAL_AWS_DEPLOYMENT.md`
2. Follow step-by-step instructions
3. Copy Lambda code from `lambda-handler.py`
4. Update `.env` with API Gateway URL

### If you choose Mock (Option 3):
```bash
# Just let me know and I'll create the mock server
```

---

**Which option would you like to proceed with?**
