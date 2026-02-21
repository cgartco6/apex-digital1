# Deploying Apex Digital on Afrihost cPanel

Since Afrihost cPanel shared hosting does not support Node.js, PostgreSQL, or background workers, we deploy only the **static frontend** on cPanel, while the backend runs on a separate VPS (e.g., Afrihost VPS, DigitalOcean, or any cloud provider).

## Prerequisites

- A cPanel account with at least 2GB disk space.
- A VPS (Ubuntu 24.04 recommended) with at least 1GB RAM.
- Domain name(s) pointed to both servers (e.g., `apex-digital.co.za` for frontend, `api.apex-digital.co.za` for backend).

## Step 1: Set Up Backend on VPS

Follow the **Ubuntu 24.04 installation script** on your VPS. After installation, ensure the backend is accessible at `http://<vps-ip>:5000`. For production, set up a reverse proxy with Nginx and SSL.

### Example Nginx config for backend:

```nginx
server {
    listen 80;
    server_name api.apex-digital.co.za;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.apex-digital.co.za;

    ssl_certificate /etc/letsencrypt/live/api.apex-digital.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.apex-digital.co.za/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
