const router = require('express').Router();
const {
  stripeWebhook,
  payfastWebhook,
  cryptoWebhook
} = require('../controllers/webhookController');

router.post('/stripe', stripeWebhook);
router.post('/payfast', payfastWebhook);
router.post('/crypto', cryptoWebhook);

module.exports = router;
// In routes/webhooks.js
router.post('/paypal', async (req, res) => {
  const { event_type, resource } = req.body;
  if (event_type === 'CHECKOUT.ORDER.APPROVED' || event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderId = resource.id;
    const capture = await paypalService.captureOrder(orderId);
    // Update payment and trigger project workflow
  }
  res.send('OK');
});
