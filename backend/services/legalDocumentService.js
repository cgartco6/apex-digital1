const { LegalDocument } = require('../models');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

class LegalDocumentService {
  async getDocument(type) {
    const doc = await LegalDocument.findOne({ where: { type } });
    if (!doc) {
      // Generate default document
      return this.generateDefault(type);
    }
    return doc;
  }

  async generateDefault(type) {
    const prompts = {
      terms: 'Generate comprehensive Terms of Service for an AI-powered design and marketing platform called Apex Digital. Include sections: Acceptance, Services, Payments, Intellectual Property, Limitation of Liability, Governing Law.',
      privacy: 'Generate a Privacy Policy compliant with POPIA and GDPR for Apex Digital. Include: Data Collection, Use of Data, Data Sharing, User Rights, Security, Contact Information.'
    };
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompts[type] }],
      max_tokens: 1500
    });
    const content = response.data.choices[0].message.content;
    const doc = await LegalDocument.create({
      type,
      content,
      version: 1
    });
    return doc;
  }

  async updateDocument(type, newContent, adminId) {
    const doc = await LegalDocument.findOne({ where: { type } });
    if (doc) {
      doc.content = newContent;
      doc.version += 1;
      doc.updatedBy = adminId;
      await doc.save();
    } else {
      await LegalDocument.create({ type, content: newContent, version: 1, updatedBy: adminId });
    }
    return doc;
  }

  async generateWithAI(type, instructions) {
    const prompt = `Update the ${type} document for Apex Digital with these instructions: ${instructions}. Keep the existing structure but incorporate the changes.`;
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500
    });
    return response.data.choices[0].message.content;
  }
}

module.exports = new LegalDocumentService();
