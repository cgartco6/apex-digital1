const axios = require('axios');

class PayPalService {
  constructor() {
    this.baseURL = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.secret = process.env.PAYPAL_SECRET;
  }

  async getAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString('base64');
    const response = await axios({
      method: 'post',
      url: `${this.baseURL}/v1/oauth2/token`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials'
    });
    return response.data.access_token;
  }

  async createOrder(amount, currency = 'ZAR', metadata) {
    const token = await this.getAccessToken();
    const response = await axios({
      method: 'post',
      url: `${this.baseURL}/v2/checkout/orders`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          },
          custom_id: JSON.stringify(metadata)
        }],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
        }
      }
    });
    return response.data;
  }

  async captureOrder(orderId) {
    const token = await this.getAccessToken();
    const response = await axios({
      method: 'post',
      url: `${this.baseURL}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}

module.exports = new PayPalService();
