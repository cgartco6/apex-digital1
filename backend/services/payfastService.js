const crypto = require('crypto');
const querystring = require('querystring');

exports.generatePaymentForm = (project) => {
  const data = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: `${process.env.FRONTEND_URL}/payment/success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    notify_url: `${process.env.BACKEND_URL}/api/webhooks/payfast`,
    name_first: project.User?.fullName || 'Client',
    email_address: project.User?.email || 'client@example.com',
    m_payment_id: `PROJ-${project.id}-${Date.now()}`,
    amount: project.price.toFixed(2),
    item_name: `${project.type} - ${project.package}`,
    item_description: project.requirements?.substring(0, 100) || 'Apex Digital Service'
  };

  // Generate signature
  const signatureString = Object.keys(data)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&');

  data.signature = crypto
    .createHash('md5')
    .update(signatureString + '&passphrase=' + process.env.PAYFAST_PASSPHRASE)
    .digest('hex');

  // Generate HTML form
  const formFields = Object.keys(data)
    .map(key => `<input type="hidden" name="${key}" value="${data[key]}">`)
    .join('\n');

  const form = `
    <form id="payfast-form" action="${process.env.PAYFAST_URL}" method="post">
      ${formFields}
    </form>
    <script>document.getElementById('payfast-form').submit();</script>
  `;

  return form;
};

exports.verifyITN = (data, signature) => {
  // Remove signature from data
  const { signature: _, ...cleanData } = data;

  // Generate signature
  const signatureString = Object.keys(cleanData)
    .sort()
    .map(key => `${key}=${encodeURIComponent(cleanData[key]).replace(/%20/g, '+')}`)
    .join('&');

  const calculatedSignature = crypto
    .createHash('md5')
    .update(signatureString + '&passphrase=' + process.env.PAYFAST_PASSPHRASE)
    .digest('hex');

  return calculatedSignature === signature;
};
