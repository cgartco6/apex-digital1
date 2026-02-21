const { SocialAccount } = require('../models');
const axios = require('axios');

class SocialAccountService {
  async connectFacebook(code, userId) {
    // Exchange code for access token
    const { data } = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code
      }
    });
    // Get long-lived token
    const longToken = await this.getLongLivedToken(data.access_token);
    // Get pages
    const pages = await this.getPages(longToken);
    // Store each page as an account
    for (const page of pages) {
      await SocialAccount.create({
        platform: 'facebook',
        accountName: page.name,
        accessToken: page.access_token,
        pageId: page.id,
        userId
      });
    }
    return pages;
  }

  async getLongLivedToken(shortToken) {
    const { data } = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: shortToken
      }
    });
    return data.access_token;
  }

  async getPages(accessToken) {
    const { data } = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: { access_token: accessToken }
    });
    return data.data;
  }

  // Similar for Twitter, Instagram, TikTok...
}

module.exports = new SocialAccountService();
