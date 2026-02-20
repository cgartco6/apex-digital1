const router = require('express').Router();
const {
  getProjects,
  getPayouts,
  getAnalytics
} = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/projects', getProjects);
router.get('/payouts', getPayouts);
router.get('/analytics', getAnalytics);

module.exports = router;
