const axios = require('axios');

class VideoService {
  async generateVideo(prompt, duration = 15) {
    // Using RunwayML Gen-2 API (example)
    const response = await axios.post('https://api.runwayml.com/v1/generate', {
      prompt,
      duration,
      api_key: process.env.RUNWAY_API_KEY
    });
    return {
      url: response.data.output,
      thumbnail: response.data.thumbnail,
      duration
    };
  }

  async generateVideoFromImages(imageUrls, transition = 'fade') {
    // Using a service like Shotstack or FFmpeg on server
    // For now, return first image as video
    return imageUrls[0];
  }

  async addCaptions(videoUrl, captions) {
    // Use a captioning service (e.g., Kapwing)
    return videoUrl;
  }
}

module.exports = new VideoService();
