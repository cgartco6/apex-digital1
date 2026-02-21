const cron = require('node-cron');
const validator = require('../services/codeValidatorService');
const logger = require('../utils/logger');

cron.schedule('0 3 * * *', async () => {
  logger.info('Running code validation...');
  try {
    const results = await validator.runFullValidation();
    // Send report to admin email
    // If critical errors, attempt auto-fix
    if (results.lint.some(f => f.errorCount > 0)) {
      await validator.autoFix();
    }
  } catch (err) {
    logger.error('Validation failed:', err);
  }
});
