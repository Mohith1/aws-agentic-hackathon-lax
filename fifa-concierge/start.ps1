# Quick Start Script for Groq FIFA Concierge

Write-Host "🚀 Starting FIFA Concierge with Groq..." -ForegroundColor Green
Write-Host ""

# Check if GROQ_API_KEY is set in .env
$envFile = Get-Content .env -Raw
if ($envFile -match "GROQ_API_KEY=your_groq_api_key_here" -or $envFile -notmatch "GROQ_API_KEY=gsk_") {
    Write-Host "⚠️  WARNING: GROQ_API_KEY not configured!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Visit https://console.groq.com/keys" -ForegroundColor Cyan
    Write-Host "2. Create a FREE API key (no credit card needed!)" -ForegroundColor Cyan
    Write-Host "3. Edit .env file and replace 'your_groq_api_key_here' with your actual key" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Example: GROQ_API_KEY=gsk_abc123xyz..." -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Check if server dependencies are installed
if (-not (Test-Path "server\node_modules")) {
    Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
    Write-Host "✅ Server dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if frontend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🎯 Starting Groq Server on http://localhost:3002..." -ForegroundColor Cyan
Write-Host "🌐 Frontend will be available on http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in EACH window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start server in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm start"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Write-Host "✅ Both servers starting in new windows!" -ForegroundColor Green
Write-Host ""
Write-Host "🎤 Voice-to-text: Deepgram (configured)" -ForegroundColor Green
Write-Host "🤖 AI Chat: Groq Llama 3.3 70B" -ForegroundColor Green
Write-Host ""
Write-Host "📖 For detailed setup instructions, see: GROQ_SETUP.md" -ForegroundColor Cyan
