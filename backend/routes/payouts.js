const router = require('express').Router();
const {
  getPayoutHistory,
  getPayout,
  requestPayout
} = require('../controllers/payoutController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', getPayoutHistory);
router.get('/:id', getPayout);
router.post('/request', requestPayout);

module.exports = router;
