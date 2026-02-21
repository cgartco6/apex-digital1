// TikTok API integration
const axios = require('axios');

class TikTokService {
  constructor() {
    this.baseURL = 'https://open-api.tiktok.com';
  }

  async postVideo(accessToken, openId, videoUrl, caption) {
    // TikTok requires video upload via a separate step
    // First, initialize upload
    const initRes = await axios.post(`${this.baseURL}/video/upload/init/`, {
      access_token: accessToken,
      open_id: openId
    });
    const uploadUrl = initRes.data.data.upload_url;

    // Upload video binary (multipart)
    // ... (simplified – use form-data)

    // Then post
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
