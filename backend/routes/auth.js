const router = require('express').Router();
const { register, login, logout, me, refreshToken } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, me);
router.post('/refresh-token', refreshToken);

module.exports = router;
