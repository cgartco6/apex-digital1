<#
.SYNOPSIS
    Full installation script for Apex Digital on Windows 10 Pro.
.DESCRIPTION
    This script installs all prerequisites, clones the repository, sets up environment variables,
    and starts the application using Docker Compose.
.NOTES
    Run as Administrator in PowerShell.
#>

#Requires -RunAsAdministrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Apex Digital Full Installation       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command($command) {
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

# Check and install prerequisites
Write-Host "`n[1/6] Checking prerequisites..." -ForegroundColor Yellow

# Check for Git
if (-not (Test-Command "git")) {
    Write-Host "Installing Git..." -ForegroundColor Yellow
    $gitInstaller = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    $installerPath = "$env:TEMP\git-installer.exe"
    Invoke-WebRequest -Uri $gitInstaller -OutFile $installerPath
    Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT /NORESTART" -Wait
    Remove-Item $installerPath
}

# Check for Node.js
if (-not (Test-Command "node")) {
    Write-Host "Installing Node.js 18..." -ForegroundColor Yellow
    $nodeInstaller = "https://nodejs.org/dist/v18.18.2/node-v18.18.2-x64.msi"
    $installerPath = "$env:TEMP\node-installer.msi"
    Invoke-WebRequest -Uri $nodeInstaller -OutFile $installerPath
    Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet"
    Remove-Item $installerPath
}

# Check for Docker Desktop
if (-not (Test-Command "docker")) {
    Write-Host "Docker Desktop not found. Please download and install from:" -ForegroundColor Red
    Write-Host "https://www.docker.com/products/docker-desktop/"
    Write-Host "After installation, restart this script."
    pause
    exit 1
}

# Clone repository
Write-Host "`n[2/6] Cloning repository..." -ForegroundColor Yellow
$repoUrl = Read-Host "Enter repository URL (default: https://github.com/your-repo/apex-digital.git)"
if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    $repoUrl = "https://github.com/your-repo/apex-digital.git"
}
$installDir = Read-Host "Enter installation directory (default: C:\apex-digital)"
if ([string]::IsNullOrWhiteSpace($installDir)) {
    $installDir = "C:\apex-digital"
}

if (Test-Path $installDir) {
    Write-Host "Directory already exists. Pulling latest changes..."
    Set-Location $installDir
    git pull
} else {
    git clone $repoUrl $installDir
    Set-Location $installDir
}

# Create environment file
Write-Host "`n[3/6] Configuring environment variables..." -ForegroundColor Yellow
Copy-Item .env.example .env

# Prompt for sensitive keys (optional, can be set later)
$openaiKey = Read-Host "Enter OpenAI API Key (press Enter to skip)"
if ($openaiKey) {
    (Get-Content .env) -replace 'OPENAI_API_KEY=.*', "OPENAI_API_KEY=$openaiKey" | Set-Content .env
}

$stripeKey = Read-Host "Enter Stripe Secret Key (press Enter to skip)"
if ($stripeKey) {
    (Get-Content .env) -replace 'STRIPE_SECRET_KEY=.*', "STRIPE_SECRET_KEY=$stripeKey" | Set-Content .env
}

# Generate random JWT secret
$jwtSecret = -join ((65..90) + (97..122) | Get-Random -Count 32 | % { [char]$_ })
(Get-Content .env) -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret" | Set-Content .env

# Start Docker containers
Write-Host "`n[4/6] Starting Docker containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.full.yml up -d

# Wait for services
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Run database seed
Write-Host "`n[5/6] Seeding database..." -ForegroundColor Yellow
docker exec apex-backend-1 node scripts/seed-admin-stats.js
docker exec apex-backend-1 node scripts/seed-legal-docs.js

# Display completion
Write-Host "`n[6/6] Installation complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "AI Microservice: http://localhost:8000" -ForegroundColor Cyan
Write-Host "`nTo stop: docker-compose -f docker-compose.full.yml down" -ForegroundColor Yellow
Write-Host "To view logs: docker-compose -f docker-compose.full.yml logs -f" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

pause
