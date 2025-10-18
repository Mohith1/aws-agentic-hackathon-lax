# FIFA 2026 Concierge - Server Startup Script
# This script starts both the backend (Groq) and frontend (React) servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIFA 2026 AI Concierge - Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if port 3002 is in use and kill it
Write-Host "[1/5] Checking for existing backend server on port 3002..." -ForegroundColor Yellow
$port = 3002
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Write-Host "  ⚠️  Found existing process $processId on port $port" -ForegroundColor Red
    Stop-Process -Id $processId -Force
    Write-Host "  ✅ Killed process $processId" -ForegroundColor Green
    Start-Sleep -Seconds 1
} else {
    Write-Host "  ✅ Port $port is available" -ForegroundColor Green
}

# Check if port 3001 is in use
Write-Host "[2/5] Checking for existing frontend server on port 3001..." -ForegroundColor Yellow
$portFrontend = 3001
$processIdFrontend = (Get-NetTCPConnection -LocalPort $portFrontend -ErrorAction SilentlyContinue).OwningProcess
if ($processIdFrontend) {
    Write-Host "  ⚠️  Found existing process $processIdFrontend on port $portFrontend" -ForegroundColor Red
    Stop-Process -Id $processIdFrontend -Force
    Write-Host "  ✅ Killed process $processIdFrontend" -ForegroundColor Green
    Start-Sleep -Seconds 1
} else {
    Write-Host "  ✅ Port $portFrontend is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/5] Starting Groq backend server on port 3002..." -ForegroundColor Yellow

# Start backend in new window
$backendPath = Join-Path $PSScriptRoot "server\groqServer.js"
$apiKey = $env:GROQ_API_KEY

if (-not $apiKey) {
    Write-Host "  ❌ Error: GROQ_API_KEY environment variable not set!" -ForegroundColor Red
    Write-Host "  Please set it in your .env file or as an environment variable" -ForegroundColor Yellow
    exit 1
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:GROQ_API_KEY = '$apiKey'; node '$backendPath'"

Write-Host "  ✅ Backend server started in new window" -ForegroundColor Green
Start-Sleep -Seconds 3

# Check if backend is responding
Write-Host "[4/5] Verifying backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
    if ($health.status -eq "healthy") {
        Write-Host "  ✅ Backend is healthy!" -ForegroundColor Green
        Write-Host "  📊 Groq API Key: $($health.groqApiKeyPresent)" -ForegroundColor Cyan
        Write-Host "  🔑 Key Prefix: $($health.keyPrefix)" -ForegroundColor Cyan
    } else {
        Write-Host "  ⚠️  Backend returned unexpected status" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Backend health check failed: $_" -ForegroundColor Red
    Write-Host "  ⚠️  Check the backend terminal window for errors" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[5/5] Starting React frontend server on port 3001..." -ForegroundColor Yellow

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

Write-Host "  ✅ Frontend server starting in new window..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Backend:  http://localhost:3002" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Wait 30 seconds for React to compile, then open:" -ForegroundColor Yellow
Write-Host "   http://localhost:3001" -ForegroundColor Cyan -NoNewline
Write-Host " in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 To stop: Close the two new PowerShell windows that opened" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit this startup script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
