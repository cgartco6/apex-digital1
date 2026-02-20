#!/bin/bash
# Apex Digital Installation Script for Ubuntu 24.04

set -e

echo "Installing Apex Digital..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Install git
sudo apt install -y git

# Clone repository
git clone https://github.com/your-repo/apex-digital.git
cd apex-digital

# Copy environment file
cp .env.example .env

# Prompt for API keys
read -p "Enter your OpenAI API Key: " openai_key
sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env

# Start Docker containers
docker-compose up -d

echo "Installation complete! Frontend: http://localhost:3000, Backend: http://localhost:5000"
echo "Note: You may need to log out and back in for Docker permissions to take effect."
