const { GoogleAdsApi } = require('google-ads-api');

class GoogleAdsService {
  constructor() {
    this.client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN
    });
  }

  async getCampaignMetrics(customerId, campaignId, startDate, endDate) {
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
    });

    const query = `
      SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.conversions,
             metrics.cost_micros, metrics.conversions_value
      FROM campaign
      WHERE campaign.id = ${campaignId}
        AND segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    const rows = await customer.query(query);
    return rows.map(row => ({
      impressions: row.metrics.impressions,
      clicks: row.metrics.clicks,
      conversions: row.metrics.conversions,
      spend: row.metrics.cost_micros / 1_000_000,
      revenue: row.metrics.conversions_value / 1_000_000
    }));
  }

  async createCampaign(customerId, campaignData) {
    // Implementation for creating campaigns via API
  }
}

module.exports = new GoogleAdsService();
