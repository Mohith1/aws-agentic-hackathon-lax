# Pulumi Installation Script for Windows
# Run this in PowerShell as Administrator

Write-Host "Installing Pulumi CLI..." -ForegroundColor Green

# Download and run the Pulumi installer
iex ((New-Object System.Net.WebClient).DownloadString('https://get.pulumi.com/install.ps1'))

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Please restart your terminal or run: refreshenv" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then navigate to the pulumi folder and run:" -ForegroundColor Cyan
Write-Host "  cd pulumi" -ForegroundColor White
Write-Host "  pulumi login --local" -ForegroundColor White
Write-Host "  pulumi up" -ForegroundColor White
