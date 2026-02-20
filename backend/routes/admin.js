const router = require('express').Router();
const { getDashboard } = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.get('/dashboard', isAdmin, getDashboard);

module.exports = router;
