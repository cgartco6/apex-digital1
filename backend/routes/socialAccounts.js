const router = require('express').Router();
const { getAccounts, connectAccount, disconnectAccount } = require('../controllers/socialAccountController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAccounts);
router.post('/connect/:platform', isAuthenticated, connectAccount);
router.delete('/:id', isAuthenticated, disconnectAccount);

module.exports = router;
