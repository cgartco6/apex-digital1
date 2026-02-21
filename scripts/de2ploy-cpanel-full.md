# Deploying Full Apex Digital on Afrihost cPanel

Since cPanel shared hosting does not support Node.js, PostgreSQL, or background workers, we deploy only the **static frontend** on cPanel, and host the backend on a cheap VPS (e.g., R50/month from Afrihost VPS).

## Step 1: Build Static Frontend
```bash
cd frontend
npm install
npm run build
# The static files will be in 'out/' folder
