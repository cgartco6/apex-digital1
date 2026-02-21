const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const execPromise = util.promisify(exec);
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

class CodeValidatorService {
  async runLint(directory = '/app') {
    try {
      const { stdout, stderr } = await execPromise(`npx eslint ${directory} --format json`);
      return JSON.parse(stdout);
    } catch (error) {
      // eslint returns non-zero exit when errors found, but stdout contains the report
      if (error.stdout) return JSON.parse(error.stdout);
      throw error;
    }
  }

  async runSecurityCheck(directory = '/app') {
    const { stdout } = await execPromise(`npx audit-ci --json`);
    return JSON.parse(stdout);
  }

  async suggestFix(filePath, lintIssue) {
    const code = await fs.readFile(filePath, 'utf8');
    const prompt = `Fix the following ${lintIssue.ruleId} issue in this code:\n\n${code}\n\nIssue: ${lintIssue.message}\nProvide only the corrected code.`;
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });
    return response.data.choices[0].message.content;
  }

  async applyFix(filePath, fixedCode) {
    await fs.writeFile(filePath, fixedCode);
  }

  async runFullValidation() {
    const lintResults = await this.runLint();
    const securityResults = await this.runSecurityCheck();
    return { lint: lintResults, security: securityResults };
  }

  async autoFix() {
    const lintResults = await this.runLint();
    for (const fileResult of lintResults) {
      for (const message of fileResult.messages) {
        if (message.severity === 2) { // error
          const fixed = await this.suggestFix(fileResult.filePath, message);
          await this.applyFix(fileResult.filePath, fixed);
          console.log(`Fixed ${fileResult.filePath}`);
        }
      }
    }
  }
}

module.exports = new CodeValidatorService();
