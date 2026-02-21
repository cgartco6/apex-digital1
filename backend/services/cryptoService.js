const axios = require('axios');

class CryptoService {
  constructor() {
    this.valrApi = axios.create({
      baseURL: 'https://api.valr.com/v1',
      headers: {
        'X-VALR-API-KEY': process.env.VALR_API_KEY,
        'X-VALR-API-SECRET': process.env.VALR_API_SECRET
      }
    });
  }

  async createInvoice(amount, currency, metadata) {
    // For demo purposes, return a mock invoice
    // In production, integrate with Valr API or similar
    
    const currencies = {
      BTC: { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
      ETH: { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
      USDT: { address: 'TX3ZvH9qKqZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9' }
    };

    const cryptoCurrency = currency === 'BTC' ? 'BTC' : 
                          currency === 'ETH' ? 'ETH' : 'USDT';

    return {
      id: `INV-${Date.now()}`,
      address: currencies[cryptoCurrency].address,
            amount: amount,
      currency: cryptoCurrency,
      metadata,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };
  }

  async verifyPayment(invoiceId) {
    // In production, check blockchain or Valr API
    // For demo, simulate payment after some time
    return true;
  }

  async getExchangeRate(fromCurrency, toCurrency) {
    try {
      const response = await this.valrApi.get('/public/marketsummary');
      const market = response.data.find(m => 
        m.currencyPair === `${fromCurrency}${toCurrency}`
      );
      return market ? parseFloat(market.lastPrice) : null;
    } catch (error) {
      console.error('Exchange rate fetch failed:', error);
      return null;
    }
  }
}

module.exports = new CryptoService();
