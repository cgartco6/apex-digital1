const router = require('express').Router();
const { askRobyn } = require('../controllers/chatbotController');

router.post('/', askRobyn);

module.exports = router;
