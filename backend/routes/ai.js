const router = require('express').Router();
const {
  generateDesign,
  predictCampaign,
  analyzeProject
} = require('../controllers/aiController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/generate-design', generateDesign);
router.post('/predict-campaign', predictCampaign);
router.post('/analyze/:projectId', analyzeProject);

module.exports = router;
