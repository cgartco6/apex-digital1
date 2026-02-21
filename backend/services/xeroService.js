const XeroClient = require('xero-node').AccountingAPIClient;

class XeroService {
  constructor() {
    this.client = new XeroClient({
      appType: 'private',
      consumerKey: process.env.XERO_CONSUMER_KEY,
      consumerSecret: process.env.XERO_CONSUMER_SECRET,
      privateKeyPath: process.env.XERO_PRIVATE_KEY_PATH
    });
  }

  async createInvoice(payment, user) {
    await this.client.invoices.create({
      Type: 'ACCREC',
      Contact: { Name: user.fullName, EmailAddress: user.email },
      LineItems: [{
        Description: `Payment for project ${payment.ProjectId}`,
        Quantity: 1,
        UnitAmount: payment.amount,
        AccountCode: '200'
      }],
      Date: new Date().toISOString().split('T')[0],
      DueDate: new Date().toISOString().split('T')[0],
      Status: 'AUTHORISED'
    });
  }
}

module.exports = new XeroService();
