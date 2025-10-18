# FIFA Concierge - Pulumi Deployment Script
# This script deploys the AWS infrastructure

Write-Host "=== FIFA World Cup 2026 AI Concierge - AWS Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the pulumi directory
if (-not (Test-Path "Pulumi.yaml")) {
    Write-Host "Error: Please run this script from the pulumi directory" -ForegroundColor Red
    Write-Host "Run: cd pulumi" -ForegroundColor Yellow
    exit 1
}

# Set PATH to include Pulumi
$env:Path = "$env:USERPROFILE\.pulumi\bin;" + $env:Path

# Verify Pulumi is available
try {
    $pulumiVersion = & pulumi version 2>&1
    Write-Host "✓ Pulumi $pulumiVersion detected" -ForegroundColor Green
} catch {
    Write-Host "✗ Pulumi not found. Please install Pulumi first." -ForegroundColor Red
    Write-Host "Run: iex ((New-Object System.Net.WebClient).DownloadString('https://get.pulumi.com/install.ps1'))" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
Write-Host ""
Write-Host "Checking AWS credentials..." -ForegroundColor Yellow
try {
    $awsProfile = aws configure list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ AWS credentials configured" -ForegroundColor Green
    } else {
        Write-Host "✗ AWS credentials not found" -ForegroundColor Red
        Write-Host "Please run: aws configure" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ AWS CLI not installed or credentials not configured" -ForegroundColor Red
    exit 1
}

# Deploy with Pulumi
Write-Host ""
Write-Host "Starting Pulumi deployment..." -ForegroundColor Cyan
Write-Host ""

# Set passphrase as environment variable to avoid prompts
$env:PULUMI_CONFIG_PASSPHRASE = ""

# Run pulumi up
Write-Host "Deploying AWS resources... This may take 3-5 minutes." -ForegroundColor Yellow
Write-Host ""

& pulumi up --yes --skip-preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Deployment Successful! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Getting API Gateway endpoint..." -ForegroundColor Cyan
    $apiEndpoint = & pulumi stack output apiEndpoint 2>&1
    
    Write-Host ""
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host " IMPORTANT: Copy this API endpoint to your .env file" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "API Endpoint: $apiEndpoint" -ForegroundColor Green
    Write-Host ""
    Write-Host "Update your .env file:" -ForegroundColor Yellow
    Write-Host "REACT_APP_API_ENDPOINT=$apiEndpoint" -ForegroundColor White
    Write-Host ""
    Write-Host "Then restart your frontend: npm start" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Save to file for easy copy
    Set-Content -Path "../API_ENDPOINT.txt" -Value $apiEndpoint
    Write-Host "✓ API endpoint also saved to: API_ENDPOINT.txt" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed. Check the errors above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. AWS credentials not configured or expired" -ForegroundColor White
    Write-Host "2. No AWS Bedrock model access (enable Claude 3.5 Sonnet v2 in Bedrock console)" -ForegroundColor White
    Write-Host "3. Insufficient IAM permissions" -ForegroundColor White
    Write-Host ""
    exit 1
}
