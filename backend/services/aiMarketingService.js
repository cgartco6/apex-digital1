const { Project, CampaignMetric } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');

class AIMarketingService {
  async createStrategy(project) {
    const { budget, targetAudience, industry, goals } = project.requirements;

    // Call AI microservice for predictions
    const prediction = await this.predictPerformance({
      budget,
      industry,
      goals
    });

    // Generate campaign structure
    const strategy = {
      channels: this.recommendChannels(industry, goals),
      timeline: this.createTimeline(project),
      budgetAllocation: this.allocateBudget(budget, prediction),
      creativeStrategy: this.generateCreativeStrategy(industry, goals),
      kpis: this.defineKPIs(goals),
      predictedResults: prediction
    };

    return strategy;
  }

  async predictPerformance(data) {
    try {
      const response = await axios.post('http://ai-microservice:8000/predict', data);
      return response.data;
    } catch (error) {
      // Fallback prediction
      return {
        ctr: Math.random() * 5 + 2,
        conversions: Math.floor(Math.random() * 1000) + 100,
        roi: Math.random() * 200 + 50
      };
    }
  }

  async optimizeCampaign(projectId) {
    const metrics = await CampaignMetric.findAll({
      where: {
        projectId,
        date: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    });

    // Analyze performance trends
    const trends = this.analyzeTrends(metrics);
    
    // Generate optimization recommendations
    const recommendations = [];

    if (trends.ctr.decreasing) {
      recommendations.push('Consider refreshing ad creative');
    }

    if (trends.cpa.increasing) {
      recommendations.push('Optimize targeting to reduce acquisition cost');
    }

    if (trends.roi.decreasing) {
      recommendations.push('Reallocate budget to better performing channels');
    }

    return recommendations;
  }

  async generateAdCopy(product, audience, tone) {
    // Use OpenAI for ad copy generation
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Generate 5 ad copy variations for ${product} targeting ${audience} with a ${tone} tone.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    return response.data.choices[0].message.content.split('\n').filter(line => line.trim());
  }

  recommendChannels(industry, goals) {
    const channelScores = {
      'google': { 'brand': 8, 'sales': 9, 'leads': 8 },
      'facebook': { 'brand': 9, 'sales': 7, 'leads': 8 },
      'linkedin': { 'brand': 6, 'sales': 5, 'leads': 9 },
      'instagram': { 'brand': 9, 'sales': 7, 'leads': 6 },
      'tiktok': { 'brand': 8, 'sales': 6, 'leads': 5 }
    };

    const goal = goals?.primary || 'brand';
    
    return Object.entries(channelScores)
      .map(([channel, scores]) => ({
        channel,
        score: scores[goal] || 5
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(c => c.channel);
  }

  createTimeline(project) {
    const startDate = new Date();
    const phases = [
      { name: 'Setup', duration: 2, tasks: ['Campaign setup', 'Audience creation', 'Ad copy'] },
      { name: 'Launch', duration: 1, tasks: ['Initial launch', 'Monitor performance'] },
      { name: 'Optimize', duration: 7, tasks: ['A/B testing', 'Optimization'] },
      { name: 'Scale', duration: 30, tasks: ['Scale winning campaigns', 'Expand audiences'] }
    ];

    return phases.map((phase, index) => ({
      ...phase,
      startDate: new Date(startDate.getTime() + index * 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(startDate.getTime() + (index + 1) * 7 * 24 * 60 * 60 * 1000)
    }));
  }

  allocateBudget(totalBudget, prediction) {
    const allocation = {
      'google': totalBudget * 0.4,
      'facebook': totalBudget * 0.3,
      'instagram': totalBudget * 0.2,
      'linkedin': totalBudget * 0.1
    };

    return allocation;
  }

  generateCreativeStrategy(industry, goals) {
    return {
      messaging: `Highlight ${industry} benefits and solutions`,
      visuals: 'Professional, high-quality images showing results',
      callToAction: goals.primary === 'sales' ? 'Buy Now' : 'Learn More'
    };
  }

  defineKPIs(goals) {
    const kpis = {
      'brand': ['impressions', 'reach', 'engagement rate'],
      'sales': ['conversions', 'roi', 'cpa'],
      'leads': ['leads', 'cpl', 'conversion rate']
    };

    return kpis[goals?.primary] || kpis['brand'];
  }

  analyzeTrends(metrics) {
    if (metrics.length < 2) {
      return { ctr: { stable: true }, cpa: { stable: true }, roi: { stable: true } };
    }

    const mid = Math.floor(metrics.length / 2);
    const firstHalf = metrics.slice(0, mid);
    const secondHalf = metrics.slice(mid);

    const avgCTRFirst = this.average(firstHalf.map(m => m.ctr));
    const avgCTRSecond = this.average(secondHalf.map(m => m.ctr));
    
    const avgCPAFirst = this.average(firstHalf.map(m => m.spend / m.conversions));
    const avgCPASecond = this.average(secondHalf.map(m => m.spend / m.conversions));
    
    const avgROIFirst = this.average(firstHalf.map(m => m.roi));
    const avgROISecond = this.average(secondHalf.map(m => m.roi));

    return {
      ctr: { decreasing: avgCTRSecond < avgCTRFirst * 0.9, increasing: avgCTRSecond > avgCTRFirst * 1.1 },
      cpa: { decreasing: avgCPASecond < avgCPAFirst * 0.9, increasing: avgCPASecond > avgCPAFirst * 1.1 },
      roi: { decreasing: avgROISecond < avgROIFirst * 0.9, increasing: avgROISecond > avgROIFirst * 1.1 }
    };
  }

  average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
}

module.exports = new AIMarketingService();
