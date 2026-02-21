const router = require('express').Router();
const { uploadProjectFile } = require('../controllers/uploadController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/', isAuthenticated, uploadProjectFile);

module.exports = router;
