#!/usr/bin/env python3
"""
Apex Digital Installation Generator
Run this script to generate a custom installation script for your environment.
"""

import os
import platform

def main():
    print("Apex Digital Installation Generator")
    print("===================================")

    # Detect OS
    os_type = platform.system()
    if os_type == "Windows":
        default_script = "install-windows.ps1"
    elif os_type == "Linux":
        default_script = "install-ubuntu.sh"
    else:
        default_script = "custom.sh"

    # Get user preferences
    install_dir = input("Installation directory [./apex-digital]: ").strip() or "./apex-digital"
    use_docker = input("Use Docker? (y/n) [y]: ").strip().lower() or "y"
    openai_key = input("OpenAI API Key (leave blank to set later): ").strip()
    stripe_key = input("Stripe Secret Key (leave blank): ").strip()
    payfast_merchant = input("PayFast Merchant ID (leave blank): ").strip()
    db_password = input("Database password [secret]: ").strip() or "secret"

    # Generate script content
    script_content = f"""#!/bin/bash
# Auto-generated installation script for Apex Digital

set -e

echo "Installing Apex Digital to {install_dir}..."

# Clone repository
git clone https://github.com/your-repo/apex-digital.git {install_dir}
cd {install_dir}

# Create .env file
cat > .env <<EOF
PORT=5000
DATABASE_URL=postgresql://apex:{db_password}@postgres:5432/apexdigital
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -hex 32)
STRIPE_SECRET_KEY={stripe_key}
PAYFAST_MERCHANT_ID={payfast_merchant}
OPENAI_API_KEY={openai_key}
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF

"""
    if use_docker == "y":
        script_content += """
# Start with Docker Compose
docker-compose up -d
echo "Installation complete! Frontend: http://localhost:3000"
"""
    else:
        script_content += """
# Manual installation (without Docker) - requires Node.js and PostgreSQL installed separately
cd backend
npm install
# ... additional steps
"""

    # Write script
    script_filename = input(f"Output filename [{default_script}]: ").strip() or default_script
    with open(script_filename, 'w') as f:
        f.write(script_content)
    os.chmod(script_filename, 0o755)

    print(f"Generated installation script: {script_filename}")

if __name__ == "__main__":
    main()
