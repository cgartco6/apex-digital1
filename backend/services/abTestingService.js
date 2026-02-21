const { ABTest, Post } = require('../models');
const socialService = require('./socialMediaService'); // existing

class ABTestingService {
  async createTest(userId, data) {
    const test = await ABTest.create({
      ...data,
      userId,
      status: 'draft'
    });
    return test;
  }

  async startTest(testId) {
    const test = await ABTest.findByPk(testId);
    if (!test) throw new Error('Test not found');
    test.status = 'running';
    test.startDate = new Date();
    await test.save();

    // Schedule posts for each variant
    const audiencePerVariant = Math.floor(test.audienceSize / test.variants.length);
    for (let i = 0; i < test.variants.length; i++) {
      const variant = test.variants[i];
      const post = await Post.create({
        content: variant.content,
        imageUrl: variant.imageUrl,
        videoUrl: variant.videoUrl,
        platforms: test.platforms,
        status: 'scheduled',
        scheduledAt: new Date(),
        abTestId: test.id,
        userId: test.userId
      });
      // Actually schedule the post via social service
      await socialService.schedulePost(test.platforms, variant, post.scheduledAt);
    }
  }

  async analyzeResults(testId) {
    const test = await ABTest.findByPk(testId, { include: [Post] });
    // Calculate engagement per variant
    const stats = test.variants.map((variant, index) => {
      const posts = test.Posts.filter(p => p.abTestId === testId && p.variantIndex === index);
      const totalEngagement = posts.reduce((sum, p) => sum + (p.performance?.likes || 0), 0);
      return { variant, engagement: totalEngagement };
    });
    const winner = stats.reduce((best, curr) => curr.engagement > best.engagement ? curr : best);
    test.winnerVariant = stats.indexOf(winner);
    test.status = 'completed';
    await test.save();
    return { stats, winner };
  }
}

module.exports = new ABTestingService();
