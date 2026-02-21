#!/bin/bash
set -e
echo "Installing Apex Digital (Full Edition) on Ubuntu 24.04..."

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

# Setup environment
cp .env.example .env
read -p "Enter OpenAI API Key: " openai_key
sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env

# Start services
docker-compose -f docker-compose.full.yml up -d

echo "Installation complete! You may need to log out and back in for Docker permissions."
