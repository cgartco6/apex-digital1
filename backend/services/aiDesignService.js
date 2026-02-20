const axios = require('axios');

exports.generateDesign = async (prompt, style) => {
  // Call OpenAI or Stable Diffusion API
  const response = await axios.post('https://api.openai.com/v1/images/generations', {
    prompt: `A ${style} style design: ${prompt}`,
    n: 1,
    size: '1024x1024'
  }, {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
  });
  return response.data.data[0].url;
};
