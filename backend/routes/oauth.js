const router = require('express').Router();
const { facebookOAuth, twitterOAuth, linkedinOAuth, instagramOAuth, tiktokOAuth, callback } = require('../controllers/oauthController');
const { isAuthenticated } = require('../middleware/auth');

// Initiate OAuth
router.get('/facebook', isAuthenticated, facebookOAuth);
router.get('/twitter', isAuthenticated, twitterOAuth);
router.get('/linkedin', isAuthenticated, linkedinOAuth);
router.get('/instagram', isAuthenticated, instagramOAuth);
router.get('/tiktok', isAuthenticated, tiktokOAuth);

// Callback URLs (these must match the redirect URIs registered with each platform)
router.get('/facebook/callback', callback('facebook'));
router.get('/twitter/callback', callback('twitter'));
router.get('/linkedin/callback', callback('linkedin'));
router.get('/instagram/callback', callback('instagram'));
router.get('/tiktok/callback', callback('tiktok'));

module.exports = router;
