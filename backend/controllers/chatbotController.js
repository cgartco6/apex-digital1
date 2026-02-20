const { Configuration, OpenAIApi } = require('openai');
const { User, Project } = require('../models');
const logger = require('../utils/logger');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

exports.askRobyn = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Get user context if authenticated
    let userContext = '';
    if (userId) {
      const user = await User.findByPk(userId, {
        include: [{ model: Project, limit: 5, order: [['createdAt', 'DESC']] }]
      });
      if (user) {
        userContext = `The user is ${user.fullName} with ${user.Projects.length} projects. `;
      }
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Robyn, an AI assistant for Apex Digital. You help with design projects, marketing campaigns, payments, and payouts. Be friendly, professional, and concise. ${userContext}`
        },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    logger.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};
