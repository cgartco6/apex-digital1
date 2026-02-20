const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

exports.askRobyn = async (req, res) => {
  const { message, conversationId } = req.body;
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are Robyn, an AI assistant for Apex Digital. Help with design projects, marketing, payments, and payouts.' },
      { role: 'user', content: message }
    ]
  });
  res.json({ reply: completion.data.choices[0].message.content });
};
