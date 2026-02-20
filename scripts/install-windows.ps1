# Apex Digital Installation Script for Windows 10 Pro
# Run in PowerShell as Administrator

Write-Host "Installing Apex Digital..." -ForegroundColor Green

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Downloading and installing..." -ForegroundColor Yellow
    $nodeInstaller = "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi"
    Invoke-WebRequest -Uri $nodeInstaller -OutFile "$env:TEMP\node-installer.msi"
    Start-Process msiexec.exe -Wait -ArgumentList "/i $env:TEMP\node-installer.msi /quiet"
    Remove-Item "$env:TEMP\node-installer.msi"
}

# Check for Docker Desktop
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Desktop not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
}

# Clone repository (if not already)
if (!(Test-Path "apex-digital")) {
    git clone https://github.com/your-repo/apex-digital.git
}
cd apex-digital

# Copy environment file
Copy-Item .env.example .env

# Prompt for API keys
$openaiKey = Read-Host "Enter your OpenAI API Key"
(Get-Content .env) -replace 'OPENAI_API_KEY=.*', "OPENAI_API_KEY=$openaiKey" | Set-Content .env

# Start Docker containers
docker-compose up -d

Write-Host "Installation complete! Frontend: http://localhost:3000, Backend: http://localhost:5000" -ForegroundColor Green
