# Apex Digital Full Installation for Windows 10 Pro
Write-Host "Installing Apex Digital (Full Edition)..." -ForegroundColor Green

# Check prerequisites
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    # Download and install Node.js
}

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
}

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Git..." -ForegroundColor Yellow
    winget install --id Git.Git -e --source winget
}

# Clone and setup
git clone https://github.com/your-repo/apex-digital.git
cd apex-digital

# Copy environment file
Copy-Item .env.example .env

# Prompt for API keys (simplified)
$openaiKey = Read-Host "Enter OpenAI API Key"
(Get-Content .env) -replace 'OPENAI_API_KEY=.*', "OPENAI_API_KEY=$openaiKey" | Set-Content .env

# Start Docker Compose
docker-compose -f docker-compose.full.yml up -d

Write-Host "Installation complete! Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:5000"
Write-Host "AI Microservice: http://localhost:8000"
