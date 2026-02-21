const Queue = require('bull');

// Create queues
const projectQueue = new Queue('project workflow', process.env.REDIS_URL);
const emailQueue = new Queue('email', process.env.REDIS_URL);
const payoutQueue = new Queue('payout', process.env.REDIS_URL);

// Queue event handlers
projectQueue.on('completed', job => {
  console.log(`Job ${job.id} completed`);
});

projectQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

emailQueue.on('completed', job => {
  console.log(`Email job ${job.id} completed`);
});

payoutQueue.on('completed', job => {
  console.log(`Payout job ${job.id} completed`);
});

module.exports = {
  projectQueue,
  emailQueue,
  payoutQueue
};
