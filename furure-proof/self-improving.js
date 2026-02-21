/**
 * self-improving.js
 * 
 * A meta‑learning service that continuously improves AI prompts and strategies
 * based on historical performance data.
 */

const { Project, CampaignMetric } = require('../backend/models');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

class SelfImproving {
  constructor() {
    this.learningRate = 0.1;
    this.version = 1;
    this.promptHistory = [];
  }

  /**
   * Analyze past campaign performance to generate better prompts
   * @param {string} type - 'design' or 'marketing'
   * @returns {Promise<string>} Improved prompt template
   */
  async improvePrompt(type) {
    // Fetch recent successful projects
    const projects = await Project.findAll({
      where: { type, status: 'completed' },
      limit: 100,
      order: [['updatedAt', 'DESC']],
      include: [CampaignMetric]
    });

    // Extract features of high‑performing campaigns
    const highPerformers = projects.filter(p => {
      if (type === 'marketing') {
        const metrics = p.CampaignMetrics;
        const avgROI = metrics.reduce((sum, m) => sum + m.roi, 0) / metrics.length;
        return avgROI > 200; // threshold
      } else {
        // For design, we might use a rating system (not implemented)
        return true;
      }
    });

    if (highPerformers.length === 0) {
      return this.getDefaultPrompt(type);
    }

    // Use OpenAI to synthesize a better prompt
    const examples = highPerformers.slice(0, 5).map(p => ({
      requirements: p.requirements,
      style: p.style,
      success: true
    }));

    const prompt = `Based on these successful project requirements, generate an improved prompt template for future ${type} projects:\n${JSON.stringify(examples, null, 2)}`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    });

    const improvedPrompt = response.data.choices[0].message.content;
    this.promptHistory.push({ version: this.version++, prompt: improvedPrompt });
    return improvedPrompt;
  }

  getDefaultPrompt(type) {
    if (type === 'design') {
      return 'Create a {{style}} design: {{requirements}}. High quality, print‑ready.';
    } else {
      return 'Generate a {{platform}} ad for {{audience}} with budget {{budget}}. Focus on {{goal}}.';
    }
  }

  /**
   * Adjust AI service parameters based on performance
   */
  async tuneHyperparameters() {
    // Example: adjust temperature, top_p, etc.
    const config = {
      temperature: 0.7 + (Math.random() - 0.5) * this.learningRate,
      max_tokens: 500
    };
    // Save to database or config
    return config;
  }
}

module.exports = new SelfImproving();
