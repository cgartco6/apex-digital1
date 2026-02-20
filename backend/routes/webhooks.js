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
