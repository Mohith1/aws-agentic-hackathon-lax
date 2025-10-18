# 🚀 Deployment Guide - FIFA World Cup 2026 AI Concierge

## Prerequisites

Before deploying, ensure you have:

- [ ] AWS Account with appropriate permissions
- [ ] AWS CLI configured (`aws configure`)
- [ ] Pulumi CLI installed (`pulumi version`)
- [ ] Node.js 18+ installed
- [ ] Deepgram API key
- [ ] Akeyless account (optional)

## Step 1: Deploy AWS Infrastructure with Pulumi

### 1.1 Install Pulumi
```bash
# Windows (PowerShell)
choco install pulumi

# macOS
brew install pulumi

# Linux
curl -fsSL https://get.pulumi.com | sh
```

### 1.2 Configure Pulumi
```bash
cd pulumi
pulumi login
pulumi stack init dev
```

### 1.3 Set AWS Region
```bash
pulumi config set aws:region us-east-1
```

### 1.4 Deploy Infrastructure
```bash
npm install
pulumi up
```

**Expected Output:**
```
Previewing update (dev)

     Type                               Name                          Plan       
 +   pulumi:pulumi:Stack                fifa-concierge-aws-dev        create     
 +   ├─ aws:dynamodb:Table             fifa-conversations            create     
 +   ├─ aws:dynamodb:Table             fifa-user-profiles            create     
 +   ├─ aws:dynamodb:Table             fifa-match-data               create     
 +   ├─ aws:iam:Role                   fifa-lambda-role              create     
 +   ├─ aws:lambda:Function            fifa-chat-handler             create     
 +   ├─ aws:lambda:Function            fifa-data-aggregator          create     
 +   ├─ aws:apigatewayv2:Api           fifa-api                      create     
 +   ├─ aws:sns:Topic                  fifa-notifications            create     
 +   └─ aws:cloudwatch:EventRule       fifa-data-update-rule         create     

Resources:
    + 15 to create

Do you want to perform this update? yes
```

### 1.5 Copy API Endpoint
After deployment completes, copy the `apiEndpoint` output:
```bash
pulumi stack output apiEndpoint
# Example: https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

## Step 2: Configure Frontend Environment

### 2.1 Create Environment File
```bash
cd ..
cp .env.example .env
```

### 2.2 Update .env File
```bash
# .env
REACT_APP_API_ENDPOINT=<your-api-gateway-endpoint-from-pulumi>
REACT_APP_DEEPGRAM_API_KEY=<your-deepgram-api-key>
REACT_APP_ENABLE_VOICE=true
```

## Step 3: Deploy Frontend to AWS Amplify

### 3.1 Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### 3.2 Initialize Amplify
```bash
amplify init

# Answer prompts:
# ? Enter a name for the project: fifaconcierge
# ? Enter a name for the environment: prod
# ? Choose your default editor: Visual Studio Code
# ? Choose the type of app: javascript
# ? What javascript framework: react
# ? Source Directory Path: src
# ? Distribution Directory Path: build
# ? Build Command: npm run build
# ? Start Command: npm start
# ? Select the authentication method: AWS profile
# ? Please choose the profile: default
```

### 3.3 Add Hosting
```bash
amplify add hosting

# Choose: Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
# Choose: Manual deployment
```

### 3.4 Build and Deploy
```bash
npm run build
amplify publish
```

**Your app will be available at the provided Amplify URL!**

## Alternative: Manual S3 + CloudFront Deployment

### 4.1 Create S3 Bucket
```bash
aws s3 mb s3://fifa-concierge-app --region us-east-1

# Enable static website hosting
aws s3 website s3://fifa-concierge-app/ --index-document index.html --error-document index.html
```

### 4.2 Build and Upload
```bash
npm run build
aws s3 sync build/ s3://fifa-concierge-app --acl public-read
```

### 4.3 Create CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --origin-domain-name fifa-concierge-app.s3.amazonaws.com \
  --default-root-object index.html
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain to Amplify
```bash
amplify add custom-domain

# Follow prompts to add your domain
# Amplify will automatically configure SSL certificate
```

### 4.2 Update DNS Records
Add CNAME records provided by Amplify to your DNS provider.

## Step 5: Set Up CI/CD (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS Amplify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_ENDPOINT: ${{ secrets.API_ENDPOINT }}
          REACT_APP_DEEPGRAM_API_KEY: ${{ secrets.DEEPGRAM_API_KEY }}
      
      - name: Deploy to Amplify
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - run: amplify publish --yes
```

## Step 6: Configure Secrets Management with Akeyless

### 6.1 Store Secrets in Akeyless
```bash
# Install Akeyless CLI
npm install -g akeyless

# Authenticate
akeyless auth --access-id <your-access-id> --access-key <your-access-key>

# Create secrets
akeyless create-secret --name fifa/deepgram-key --value <your-deepgram-key>
akeyless create-secret --name fifa/openai-key --value <your-openai-key>
```

### 6.2 Update Lambda to Use Akeyless
Modify Lambda environment to fetch secrets from Akeyless instead of hardcoding.

## Step 7: Enable Amazon Bedrock Access

### 7.1 Request Model Access
1. Go to AWS Console → Amazon Bedrock
2. Navigate to "Model access"
3. Request access to "Claude 4.5 Sonnet"
4. Wait for approval (usually instant)

### 7.2 Verify Access
```bash
aws bedrock list-foundation-models --region us-east-1
```

## Step 8: Test Deployment

### 8.1 Test API Endpoint
```bash
curl -X POST <your-api-endpoint>/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "When is USA vs Mexico playing?",
    "conversationHistory": [],
    "userId": "test-user"
  }'
```

### 8.2 Test Frontend
1. Open the Amplify URL in browser
2. Test chat functionality
3. Test voice input (if enabled)
4. Test navigation between pages
5. Test mobile responsiveness

## Step 9: Monitor and Maintain

### 9.1 Set Up CloudWatch Alarms
```bash
# Create alarm for Lambda errors
aws cloudwatch put-metric-alarm \
  --alarm-name fifa-lambda-errors \
  --alarm-description "Alert on Lambda errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

### 9.2 View Logs
```bash
# Lambda logs
aws logs tail /aws/lambda/fifa-chat-handler --follow

# API Gateway logs
aws logs tail /aws/apigateway/fifa-api --follow
```

## Troubleshooting

### Issue: Lambda timeout
**Solution**: Increase timeout in Pulumi configuration:
```typescript
timeout: 60  // seconds
```

### Issue: CORS errors
**Solution**: Verify API Gateway CORS configuration:
```typescript
corsConfiguration: {
    allowOrigins: ["*"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
}
```

### Issue: Bedrock access denied
**Solution**: 
1. Ensure IAM role has bedrock:InvokeModel permission
2. Verify model access is granted in Bedrock console
3. Check region (Bedrock may not be available in all regions)

### Issue: Build fails
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Deployment Checklist

- [ ] AWS infrastructure deployed via Pulumi
- [ ] API Gateway endpoint configured in .env
- [ ] Deepgram API key added to .env
- [ ] Frontend built successfully (`npm run build`)
- [ ] App deployed to Amplify
- [ ] Custom domain configured (optional)
- [ ] Bedrock model access granted
- [ ] CI/CD pipeline set up
- [ ] Monitoring and alarms configured
- [ ] Production secrets stored in Akeyless
- [ ] Load testing completed
- [ ] Demo script prepared

## Production Optimization

### Performance
- Enable CloudFront caching
- Compress images and assets
- Use lazy loading for components
- Implement service workers for offline support

### Security
- Enable AWS WAF for API Gateway
- Implement rate limiting
- Add authentication with Cognito
- Regularly rotate API keys

### Cost Optimization
- Set DynamoDB to on-demand billing
- Use Lambda reserved concurrency
- Enable S3 lifecycle policies
- Monitor with Cost Explorer

## Support

For deployment issues:
1. Check CloudWatch Logs
2. Review Pulumi state: `pulumi stack`
3. Verify IAM permissions
4. Contact AWS Support or create GitHub issue

---

**Deployment Complete! Your FIFA 2026 AI Concierge is live! ⚽🏆**
