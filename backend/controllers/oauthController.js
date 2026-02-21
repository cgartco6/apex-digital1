const crypto = require('crypto');
const { SocialAccount } = require('../models');
const axios = require('axios');

// Store state in a temporary store (e.g., Redis) with user ID
const stateStore = new Map(); // In production, use Redis

exports.facebookOAuth = (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  stateStore.set(state, req.user.id);
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&state=${state}&scope=pages_read_engagement,pages_manage_posts,publish_to_groups`;
  res.json({ url: authUrl });
};

exports.callback = (platform) => async (req, res) => {
  const { code, state } = req.query;
  const userId = stateStore.get(state);
  if (!userId) return res.status(400).send('Invalid state');
  stateStore.delete(state);

  try {
    let tokenData, pages;
    switch (platform) {
      case 'facebook':
        // Exchange code for token
        const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            code
          }
        });
        const shortToken = tokenRes.data.access_token;
        // Get long-lived token
        const longRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: shortToken
          }
        });
        const longToken = longRes.data.access_token;
        // Get pages
        const pagesRes = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
          params: { access_token: longToken }
        });
        pages = pagesRes.data.data;
        // Store each page as an account
        for (const page of pages) {
          await SocialAccount.create({
            platform: 'facebook',
            accountName: page.name,
            accessToken: page.access_token,
            refreshToken: longToken,
            pageId: page.id,
            userId
          });
        }
        break;
      // Similar for other platforms...
    }
    res.redirect(`${process.env.FRONTEND_URL}/social-accounts?success=1`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/social-accounts?error=1`);
  }
};

// Implement twitter, linkedin, instagram, tiktok similarly
