const axios = require('axios');

class InstagramService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
  }

  async postImage(instagramAccountId, imageUrl, caption, accessToken) {
    // Step 1: Create media container
    const createRes = await axios.post(`${this.baseURL}/${instagramAccountId}/media`, {
      image_url: imageUrl,
      caption,
      access_token: accessToken
    });
    const creationId = createRes.data.id;

    // Step 2: Publish
    const publishRes = await axios.post(`${this.baseURL}/${instagramAccountId}/media_publish`, {
      creation_id: creationId,
      access_token: accessToken
    });
    return publishRes.data;
  }

  async postVideo(instagramAccountId, videoUrl, caption, accessToken) {
    const createRes = await axios.post(`${this.baseURL}/${instagramAccountId}/media`, {
      video_url: videoUrl,
      media_type: 'VIDEO',
      caption,
      access_token: accessToken
    });
    const creationId = createRes.data.id;
    const publishRes = await axios.post(`${this.baseURL}/${instagramAccountId}/media_publish`, {
      creation_id: creationId,
      access_token: accessToken
    });
    return publishRes.data;
  }

  async getInsights(instagramAccountId, accessToken) {
    const res = await axios.get(`${this.baseURL}/${instagramAccountId}/insights`, {
      params: {
        metric: 'impressions,reach,profile_views',
        period: 'day',
        access_token: accessToken
      }
    });
    return res.data;
  }
}

module.exports = new InstagramService();
