// Adapter pattern to swap out AI providers easily
class AGIAdapter {
  constructor(provider = 'openai') {
    this.provider = provider;
  }

  async generate(prompt, type = 'text') {
    switch (this.provider) {
      case 'openai':
        // call OpenAI
        break;
      case 'anthropic':
        // call Claude
        break;
      case 'agi':
        // call future AGI API
        break;
      default:
        throw new Error('Unknown provider');
    }
  }
}

module.exports = AGIAdapter;
