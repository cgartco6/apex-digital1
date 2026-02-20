# Deploying Apex Digital on Afrihost cPanel

**Important**: cPanel shared hosting does not support Node.js or PostgreSQL. To run the full stack, you need a VPS. However, you can deploy the **frontend** as static files and connect to a backend hosted elsewhere (e.g., a cheap VPS or Heroku). Below are instructions for that approach.

## Option 1: Deploy Frontend Only (Static)

1. Build the Next.js frontend:

2.    The static files will be in `out/` folder.

2. In cPanel, open **File Manager** and upload the contents of `out/` to `public_html/`.

3. Ensure the backend API URL is set correctly in the frontend build (e.g., via environment variable `NEXT_PUBLIC_API_URL` pointing to your backend server).

## Option 2: Use a VPS (Recommended)

Rent a cheap VPS (e.g., R50/month from Afrihost VPS) and follow the Ubuntu installation script. Then point your domain to the VPS IP.

## Database

If you absolutely must use the 1x SQL database in cPanel, you can replace PostgreSQL with MySQL and rewrite the backend in PHP. This is not covered here.

## Alternative: Use a Backend‑as‑a‑Service

Use Heroku (free tier) for the backend and PostgreSQL, and cPanel for the frontend static files. Configure CORS accordingly.
