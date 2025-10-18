@echo off
echo ========================================
echo FIFA 2026 Concierge - Backend Server
echo ========================================
echo.

cd /d "%~dp0server"

if "%GROQ_API_KEY%"=="" (
    echo ERROR: GROQ_API_KEY environment variable not set!
    echo Please set it in your .env file or as an environment variable
    pause
    exit /b 1
)

echo Starting Groq backend server...
echo API Key configured: YES
echo Port: 3002
echo.

node groqServer.js

pause
