const Parser = require('rss-parser');
const socialService = require('./socialMediaService');
const { Trigger } = require('../models');

const parser = new Parser();

class TriggerService {
  async checkRSSFeeds() {
    const triggers = await Trigger.findAll({ where: { type: 'rss', active: true } });
    for (const trigger of triggers) {
      const feed = await parser.parseURL(trigger.config.url);
      const latestItem = feed.items[0];
      if (!trigger.lastProcessed || new Date(latestItem.pubDate) > new Date(trigger.lastProcessed)) {
        // Generate content from RSS item
        const content = `${latestItem.title}\n\n${latestItem.contentSnippet}`;
        // Post to configured platforms
        for (const platform of trigger.config.platforms) {
          await socialService.postToPlatform(platform, content, null, null, trigger.config.accountId);
        }
        trigger.lastProcessed = new Date();
        await trigger.save();
      }
    }
  }
}

module.exports = new TriggerService();
