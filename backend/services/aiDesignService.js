const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

class AIDesignService {
  async generateDesign(prompt, style) {
    try {
      const enhancedPrompt = this.enhancePrompt(prompt, style);
      
      const response = await openai.createImage({
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      });

      return response.data.data[0].url;
    } catch (error) {
      throw new Error(`Design generation failed: ${error.message}`);
    }
  }

  async generateVariations(imageUrl, count = 4) {
    try {
      // Download image
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      // Create variations
      const variations = await openai.createImageVariation(
        buffer,
        count,
        '1024x1024'
      );

      return variations.data.data.map(v => v.url);
    } catch (error) {
      throw new Error(`Variation generation failed: ${error.message}`);
    }
  }

  async generateMockup(designUrl, productType) {
    // This would integrate with a mockup generation API
    // For now, return placeholder
    const mockupTemplates = {
      'business-card': 'https://example.com/mockups/business-card-template.png',
      'flyer': 'https://example.com/mockups/flyer-template.png',
      'poster': 'https://example.com/mockups/poster-template.png',
      'vehicle-wrap': 'https://example.com/mockups/vehicle-template.png'
    };

    return {
      mockupUrl: mockupTemplates[productType] || mockupTemplates['business-card'],
      designUrl
    };
  }

  async analyzeDesign(designUrl) {
    // Use GPT-4 Vision to analyze design
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional design critic. Analyze the design and provide constructive feedback.'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please analyze this design:' },
              { type: 'image_url', image_url: designUrl }
            ]
          }
        ],
        max_tokens: 500
      });

      return {
        analysis: response.data.choices[0].message.content,
        suggestions: this.extractSuggestions(response.data.choices[0].message.content)
      };
    } catch (error) {
      throw new Error(`Design analysis failed: ${error.message}`);
    }
  }

  enhancePrompt(prompt, style) {
    const styleDescriptions = {
      'classic': 'timeless, elegant, traditional design',
      'cartoon': 'colorful, playful, animated style',
      'traditional': 'hand-drawn, organic, artistic feel',
      'modern': 'minimalist, clean, contemporary',
      'futuristic': 'sci-fi, high-tech, innovative',
      'out-of-the-box': 'creative, unconventional, surprising'
    };

    const styleDesc = styleDescriptions[style] || 'professional design';
    return `Create a ${styleDesc} design based on: ${prompt}. High quality, print-ready.`;
  }

  extractSuggestions(analysis) {
    // Simple extraction - in production, use NLP
    const lines = analysis.split('\n');
    return lines
      .filter(line => line.includes('suggest') || line.includes('recommend'))
      .map(line => line.trim());
  }
}

module.exports = new AIDesignService();
