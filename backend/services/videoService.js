const axios = require('axios');
const FormData = require('form-data');

class VideoService {
  constructor() {
    this.apiKey = process.env.RUNWAYML_API_KEY;
    this.baseURL = 'https://api.runwayml.com/v1';
  }

  async generateVideo(prompt, duration = 5) {
    try {
      const response = await axios.post(`${this.baseURL}/generations`, {
        prompt,
        duration,
        model: 'gen-2',
        api_key: this.apiKey
      });
      return {
        id: response.data.id,
        url: response.data.output,
        thumbnail: response.data.thumbnail,
        duration
      };
    } catch (error) {
      throw new Error(`Video generation failed: ${error.message}`);
    }
  }

  async generateVideoFromImages(imageUrls, transition = 'fade') {
    // Use Runway's image-to-video or another service
    const form = new FormData();
    imageUrls.forEach((url, i) => form.append('images', url));
    form.append('transition', transition);
    form.append('api_key', this.apiKey);
    
    const response = await axios.post(`${this.baseURL}/image-to-video`, form, {
      headers: form.getHeaders()
    });
    return response.data.output;
  }

  async addCaptions(videoUrl, captions) {
    // Use a service like Kapwing or custom FFmpeg
    return videoUrl; // Placeholder
  }
}

module.exports = new VideoService();
