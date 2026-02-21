const router = require('express').Router();
const legalService = require('../services/legalDocumentService');
const { isAdmin } = require('../middleware/auth');

router.get('/terms', async (req, res) => {
  const doc = await legalService.getDocument('terms');
  res.json({ content: doc.content, updatedAt: doc.updatedAt });
});

router.get('/privacy', async (req, res) => {
  const doc = await legalService.getDocument('privacy');
  res.json({ content: doc.content, updatedAt: doc.updatedAt });
});

// Admin endpoints to update documents
router.put('/terms', isAdmin, async (req, res) => {
  const { content } = req.body;
  const doc = await legalService.updateDocument('terms', content, req.user.id);
  res.json(doc);
});

router.post('/terms/generate', isAdmin, async (req, res) => {
  const { instructions } = req.body;
  const content = await legalService.generateWithAI('terms', instructions);
  res.json({ content });
});

// Similar for privacy...

module.exports = router;
