const axios = require('axios');

class FacebookAdsService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
  }

  async getCampaignMetrics(campaignId, datePreset = 'last_30d') {
    try {
      const response = await axios.get(`${this.baseURL}/${campaignId}/insights`, {
        params: {
          access_token: this.accessToken,
          fields: 'impressions,clicks,conversions,spend,reach',
          date_preset: datePreset
        }
      });
      return response.data.data[0] || {};
    } catch (error) {
      throw new Error(`Facebook API error: ${error.message}`);
    }
  }

  async createCampaign(name, objective, budget, targeting) {
    // Implementation for creating campaign via Facebook API
    const response = await axios.post(`${this.baseURL}/act_${this.adAccountId}/campaigns`, {
      name,
      objective,
      status: 'PAUSED',
      special_ad_categories: [],
      access_token: this.accessToken
    });
    return response.data;
  }
}

module.exports = new FacebookAdsService();
