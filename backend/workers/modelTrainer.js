const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

// Run daily at 2 AM
cron.schedule('0 2 * * *', () => {
  logger.info('Starting model training...');
  
  const pythonProcess = spawn('python3', [
    path.join(__dirname, '../../ai-microservice/train_model.py'),
    '--fetch-live-data'
  ]);

  pythonProcess.stdout.on('data', (data) => {
    logger.info(`[Trainer] ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    logger.error(`[Trainer] ${data}`);
  });

  pythonProcess.on('close', (code) => {
    logger.info(`Training finished with code ${code}`);
  });
});
