const axios = require('axios');

class InstagramService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
  }

  async postImage(instagramAccountId, imageUrl, caption, accessToken) {
    // First create media container
    const createRes = await axios.post(`${this.baseURL}/${instagramAccountId}/media`, {
      image_url: imageUrl,
      caption,
      access_token: accessToken
    });
    const creationId = createRes.data.id;
    // Then publish
    const publishRes = await axios.post(`${this.baseURL}/${instagramAccountId}/media_publish`, {
      creation_id: creationId,
      access_token: accessToken
    });
    return publishRes.data;
  }

  async postVideo(instagramAccountId, videoUrl, caption, accessToken) {
    // Similar with video_url
  }
}

module.exports = new InstagramService();
