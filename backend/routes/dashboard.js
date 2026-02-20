const router = require('express').Router();
const { getProjects, getPayouts, getAnalytics } = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');

// All routes require authentication
router.use(isAuthenticated);

// Get all projects for the logged-in client
router.get('/projects', getProjects);

// Get payout history and current balance for the client
router.get('/payouts', getPayouts);

// Get campaign analytics for client's marketing projects
router.get('/analytics', getAnalytics);

module.exports = router;
