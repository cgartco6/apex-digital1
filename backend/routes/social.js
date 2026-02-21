const router = require('express').Router();
const socialService = require('../services/socialMediaService');
const { isAuthenticated } = require('../middleware/auth');

router.post('/generate-content', isAuthenticated, async (req, res) => {
  const { topic, platform, tone } = req.body;
  const content = await socialService.generatePostContent(topic, platform, tone);
  res.json({ content });
});

router.post('/generate-image', isAuthenticated, async (req, res) => {
  const { description, style } = req.body;
  const imageUrl = await socialService.generateImage(description, style);
  res.json({ imageUrl });
});

router.post('/post', isAuthenticated, async (req, res) => {
  const { platform, content, imageUrl, scheduleTime } = req.body;
  if (scheduleTime) {
    // Schedule for later
    await socialService.schedulePost(platform, content, imageUrl, scheduleTime);
    res.json({ message: 'Post scheduled' });
  } else {
    let result;
    switch (platform) {
      case 'facebook':
        result = await socialService.postToFacebook(process.env.FACEBOOK_PAGE_ID, content, imageUrl);
        break;
      case 'twitter':
        result = await socialService.postToTwitter(content, imageUrl);
        break;
      // ... other platforms
    }
    res.json(result);
  }
});

module.exports = router;
