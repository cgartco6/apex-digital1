const Queue = require('bull');
const socialService = require('../services/socialMediaService');

const postQueue = new Queue('post scheduling', process.env.REDIS_URL);

postQueue.process(async (job) => {
  const { platform, content, imageUrl, videoUrl, accountId } = job.data;
  // Post immediately
  await socialService.postToPlatform(platform, content, imageUrl, videoUrl, accountId);
});

module.exports = postQueue;
