
---

### 4. Installer Generator (Python)

#### `scripts/install-generator.py`

```python
#!/usr/bin/env python3
"""
Apex Digital Installation Generator
-----------------------------------
This script generates custom installation scripts for Windows, Ubuntu,
or a combined script based on user input.
"""

import os
import sys
import getpass
from datetime import datetime

def generate_windows_script(config):
    """Generate Windows PowerShell installation script."""
    content = f"""<#
.SYNOPSIS
    Custom installation script for Apex Digital on Windows
.DESCRIPTION
    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
#>

#Requires -RunAsAdministrator

Write-Host "Installing Apex Digital..." -ForegroundColor Green

# Variables
$repoUrl = "{config['repo_url']}"
$installDir = "{config['install_dir']}"
$openaiKey = "{config['openai_key']}"
$stripeKey = "{config['stripe_key']}"
$jwtSecret = "{config['jwt_secret']}"

# Clone repository
if (Test-Path $installDir) {{
    Set-Location $installDir
    git pull
}} else {{
    git clone $repoUrl $installDir
    Set-Location $installDir
}}

# Configure .env
Copy-Item .env.example .env
(Get-Content .env) -replace 'OPENAI_API_KEY=.*', "OPENAI_API_KEY=$openaiKey" | Set-Content .env
(Get-Content .env) -replace 'STRIPE_SECRET_KEY=.*', "STRIPE_SECRET_KEY=$stripeKey" | Set-Content .env
(Get-Content .env) -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret" | Set-Content .env

# Start Docker
docker-compose -f docker-compose.full.yml up -d

Write-Host "Installation complete! Frontend: http://localhost:3000"
"""
    return content

def generate_ubuntu_script(config):
    """Generate Ubuntu bash installation script."""
    content = f"""#!/bin/bash
# Custom installation script for Apex Digital on Ubuntu
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

set -e

REPO_URL="{config['repo_url']}"
INSTALL_DIR="{config['install_dir']}"
OPENAI_KEY="{config['openai_key']}"
STRIPE_KEY="{config['stripe_key']}"
JWT_SECRET="{config['jwt_secret']}"

# Clone repository
if [ -d "$INSTALL_DIR" ]; then
    cd "$INSTALL_DIR"
    git pull
else
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Configure .env
cp .env.example .env
sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$OPENAI_KEY/" .env
sed -i "s/STRIPE_SECRET_KEY=.*/STRIPE_SECRET_KEY=$STRIPE_KEY/" .env
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env

# Start Docker
sudo docker-compose -f docker-compose.full.yml up -d

echo "Installation complete! Frontend: http://localhost:3000"
"""
    return content

def main():
    print("="*50)
    print("Apex Digital Installer Generator")
    print("="*50)
    
    # Gather configuration
    config = {}
    
    config['repo_url'] = input("Repository URL [https://github.com/your-repo/apex-digital.git]: ").strip()
    if not config['repo_url']:
        config['repo_url'] = "https://github.com/your-repo/apex-digital.git"
    
    config['install_dir'] = input("Installation directory [./apex-digital]: ").strip()
    if not config['install_dir']:
        config['install_dir'] = "./apex-digital"
    
    config['openai_key'] = getpass.getpass("OpenAI API Key (hidden): ").strip()
    config['stripe_key'] = getpass.getpass("Stripe Secret Key (hidden): ").strip()
    
    # Generate a random JWT secret
    import secrets
    config['jwt_secret'] = secrets.token_hex(32)
    
    # Choose target platform
    print("\nSelect target platform:")
    print("1. Windows 10 Pro")
    print("2. Ubuntu 24.04")
    print("3. Both")
    choice = input("Enter choice (1/2/3): ").strip()
    
    if choice == '1':
        script = generate_windows_script(config)
        filename = "install-apex-windows.ps1"
        with open(filename, 'w') as f:
            f.write(script)
        print(f"Generated {filename}")
    elif choice == '2':
        script = generate_ubuntu_script(config)
        filename = "install-apex-ubuntu.sh"
        with open(filename, 'w') as f:
            f.write(script)
        os.chmod(filename, 0o755)
        print(f"Generated {filename}")
    elif choice == '3':
        win_script = generate_windows_script(config)
        ubuntu_script = generate_ubuntu_script(config)
        with open("install-apex-windows.ps1", 'w') as f:
            f.write(win_script)
        with open("install-apex-ubuntu.sh", 'w') as f:
            f.write(ubuntu_script)
        os.chmod("install-apex-ubuntu.sh", 0o755)
        print("Generated install-apex-windows.ps1 and install-apex-ubuntu.sh")
    else:
        print("Invalid choice.")
        sys.exit(1)

if __name__ == "__main__":
    main()
