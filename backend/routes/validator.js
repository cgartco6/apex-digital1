const router = require('express').Router();
const validator = require('../services/codeValidatorService');
const { isAdmin } = require('../middleware/auth');

router.get('/run', isAdmin, async (req, res) => {
  const results = await validator.runFullValidation();
  res.json(results);
});

router.post('/fix', isAdmin, async (req, res) => {
  await validator.autoFix();
  res.json({ message: 'Auto‑fix completed' });
});

module.exports = router;
