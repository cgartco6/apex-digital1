#!/bin/bash
# upgrade-to-agi.sh
# Script to upgrade Apex Digital to use an AGI backend instead of current AI services.

set -e

echo "========================================"
echo "   Apex Digital AGI Upgrade Script     "
echo "========================================"

# Configuration
AGI_ENDPOINT=${1:-"https://agi.example.com/v1"}
AGI_API_KEY=${2:-""}
BACKEND_DIR="../backend"
ENV_FILE="$BACKEND_DIR/.env"

# Check if running in the scripts directory
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found. Please run from the scripts directory."
    exit 1
fi

# Prompt for AGI endpoint if not provided
if [ -z "$AGI_API_KEY" ]; then
    read -p "Enter AGI API Key: " AGI_API_KEY
fi

# Update environment variables
echo "Updating environment variables..."
sed -i "s|^AI_PROVIDER=.*|AI_PROVIDER=agi|" "$ENV_FILE"
sed -i "s|^AGI_ENDPOINT=.*|AGI_ENDPOINT=$AGI_ENDPOINT|" "$ENV_FILE"
sed -i "s|^AGI_API_KEY=.*|AGI_API_KEY=$AGI_API_KEY|" "$ENV_FILE"

# Create a backup of current AI services
echo "Backing up existing AI services..."
cp "$BACKEND_DIR/services/aiDesignService.js" "$BACKEND_DIR/services/aiDesignService.js.bak"
cp "$BACKEND_DIR/services/aiMarketingService.js" "$BACKEND_DIR/services/aiMarketingService.js.bak"

# Replace with AGI adapter
echo "Replacing AI services with AGI adapter..."
cat > "$BACKEND_DIR/services/agiAdapter.js" <<EOF
const axios = require('axios');

class AGIAdapter {
  constructor() {
    this.endpoint = process.env.AGI_ENDPOINT;
    this.apiKey = process.env.AGI_API_KEY;
  }

  async generate(prompt, type = 'text') {
    const response = await axios.post(this.endpoint, {
      prompt,
      type,
      api_key: this.apiKey
    });
    return response.data;
  }
}

module.exports = new AGIAdapter();
EOF

# Update the services to use AGI adapter
for service in aiDesignService aiMarketingService; do
    cat > "$BACKEND_DIR/services/$service.js" <<EOF
const agiAdapter = require('./agiAdapter');

module.exports = {
  async generateDesign(prompt, style) {
    const result = await agiAdapter.generate(\`Create a \${style} design: \${prompt}\`, 'image');
    return result.url;
  },
  // ... other methods
};
EOF
done

echo "Restarting backend services..."
cd "$BACKEND_DIR"
pm2 restart all || docker-compose restart backend

echo "AGI upgrade complete! Verify by checking logs."
