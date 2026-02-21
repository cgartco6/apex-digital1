const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

class SocialMediaService {
  async generatePostContent(topic, platform, tone = 'professional') {
    const prompt = `Create a ${platform} post about ${topic} with a ${tone} tone. Include relevant hashtags.`;
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    });
    return response.data.choices[0].message.content;
  }

  async generateImage(description, style = 'modern') {
    const response = await openai.createImage({
      prompt: `A ${style} style image for: ${description}`,
      n: 1,
      size: '1024x1024'
    });
    return response.data.data[0].url;
  }

  async postToFacebook(pageId, content, imageUrl) {
    const url = `https://graph.facebook.com/v18.0/${pageId}/photos`;
    const params = {
      access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      message: content,
      url: imageUrl
    };
    return axios.post(url, params);
  }

  async postToTwitter(content, imageUrl) {
    // Use Twitter API v2 with media upload
    // Simplified – requires OAuth 1.0a
    const { TwitterApi } = require('twitter-api-v2');
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    const mediaId = await client.v1.uploadMedia(imageUrl);
    return client.v2.tweet({ text: content, media: { media_ids: [mediaId] } });
  }

  async postToLinkedIn(content, imageUrl) {
    // LinkedIn API
  }

  async schedulePost(platform, content, imageUrl, scheduleTime) {
    // Store in database and queue for later posting
  }
}

module.exports = new SocialMediaService();
