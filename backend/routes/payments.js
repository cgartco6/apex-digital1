const router = require('express').Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getPayment
} = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.get('/:id', getPayment);

module.exports = router;
