const axios = require('axios');
const querystring = require('querystring');

class TikTokService {
  constructor() {
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI;
    this.baseURL = 'https://open-api.tiktok.com';
  }

  getAuthUrl(state) {
    return `https://www.tiktok.com/v2/auth/authorize/?client_key=${this.clientKey}&response_type=code&scope=user.info.basic,video.upload&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}`;
  }

  async getAccessToken(code) {
    const response = await axios.post(`${this.baseURL}/oauth/access_token/`, querystring.stringify({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.data;
  }

  async postVideo(accessToken, openId, videoUrl, caption) {
    // Step 1: Initialize upload
    const initRes = await axios.post(`${this.baseURL}/video/upload/init/`, {
      access_token: accessToken,
      open_id: openId
    });
    const uploadUrl = initRes.data.data.upload_url;

    // Step 2: Upload video binary (simplified – use form-data)
    const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const uploadRes = await axios.put(uploadUrl, videoBuffer.data, {
      headers: { 'Content-Type': 'video/mp4' }
    });

    // Step 3: Post video
    const postRes = await axios.post(`${this.baseURL}/video/publish/`, {
      access_token: accessToken,
      open_id: openId,
      post_info: {
        title: caption,
        privacy_level: 'PUBLIC'
      }
    });
    return postRes.data;
  }
}

module.exports = new TikTokService();
