const { spawn } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

class TrainingService {
  runTraining(fetchLiveData = true) {
    return new Promise((resolve, reject) => {
      const args = ['train_model.py'];
      if (fetchLiveData) args.push('--fetch-live-data');
      
      const pythonProcess = spawn('python3', args, {
        cwd: path.join(__dirname, '../../ai-microservice')
      });

      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data;
        logger.info(`[Trainer] ${data}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        logger.error(`[Trainer] ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) resolve(output);
        else reject(new Error(`Training failed with code ${code}`));
      });
    });
  }

  scheduleTraining(cronExpression = '0 2 * * *') {
    const cron = require('node-cron');
    cron.schedule(cronExpression, () => {
      logger.info('Running scheduled model training');
      this.runTraining(true).catch(err => {
        logger.error('Scheduled training failed:', err);
      });
    });
  }
}

module.exports = new TrainingService();
