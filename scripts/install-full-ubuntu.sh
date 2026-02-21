#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   Apex Digital Full Installation       ${NC}"
echo -e "${CYAN}========================================${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "\n${YELLOW}[1/6] Checking prerequisites...${NC}"

# Update package list
sudo apt update

# Install Git if not present
if ! command_exists git; then
    echo "Installing Git..."
    sudo apt install -y git
fi

# Install Node.js 18 if not present
if ! command_exists node; then
    echo "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install Docker if not present
if ! command_exists docker; then
    echo "Installing Docker..."
    sudo apt install -y docker.io
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}Docker installed. You may need to log out and back in for group changes to take effect.${NC}"
fi

# Install Docker Compose if not present
if ! command_exists docker-compose; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Clone repository
echo -e "\n${YELLOW}[2/6] Cloning repository...${NC}"
read -p "Enter repository URL (default: https://github.com/your-repo/apex-digital.git): " REPO_URL
REPO_URL=${REPO_URL:-https://github.com/your-repo/apex-digital.git}

read -p "Enter installation directory (default: $HOME/apex-digital): " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-$HOME/apex-digital}

if [ -d "$INSTALL_DIR" ]; then
    echo "Directory exists. Pulling latest changes..."
    cd "$INSTALL_DIR"
    git pull
else
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Create environment file
echo -e "\n${YELLOW}[3/6] Configuring environment variables...${NC}"
cp .env.example .env

# Prompt for sensitive keys
read -p "Enter OpenAI API Key (press Enter to skip): " OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$OPENAI_KEY/" .env
fi

read -p "Enter Stripe Secret Key (press Enter to skip): " STRIPE_KEY
if [ -n "$STRIPE_KEY" ]; then
    sed -i "s/STRIPE_SECRET_KEY=.*/STRIPE_SECRET_KEY=$STRIPE_KEY/" .env
fi

# Generate random JWT secret
JWT_SECRET=$(openssl rand -hex 32)
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env

# Start Docker containers
echo -e "\n${YELLOW}[4/6] Starting Docker containers...${NC}"
sudo docker-compose -f docker-compose.full.yml up -d

# Wait for services
echo "Waiting for services to start..."
sleep 30

# Run database seed
echo -e "\n${YELLOW}[5/6] Seeding database...${NC}"
sudo docker exec apex-backend-1 node scripts/seed-admin-stats.js
sudo docker exec apex-backend-1 node scripts/seed-legal-docs.js

# Completion
echo -e "\n${GREEN}[6/6] Installation complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Frontend: http://localhost:3000${NC}"
echo -e "${CYAN}Backend API: http://localhost:5000${NC}"
echo -e "${CYAN}AI Microservice: http://localhost:8000${NC}"
echo -e "\n${YELLOW}To stop: sudo docker-compose -f docker-compose.full.yml down${NC}"
echo -e "${YELLOW}To view logs: sudo docker-compose -f docker-compose.full.yml logs -f${NC}"
echo -e "${CYAN}========================================${NC}"
