const { Project } = require('../models');
const aiDesignService = require('../services/aiDesignService');
const aiMarketingService = require('../services/aiMarketingService');
const axios = require('axios');
const logger = require('../utils/logger');

exports.generateDesign = async (req, res) => {
  try {
    const { prompt, style } = req.body;

    const imageUrl = await aiDesignService.generateDesign(prompt, style);

    res.json({ imageUrl });
  } catch (error) {
    logger.error('Generate design error:', error);
    res.status(500).json({ error: 'Failed to generate design' });
  }
};

exports.predictCampaign = async (req, res) => {
  try {
    const { budget, audienceSize, industry } = req.body;

    // Call AI microservice
    const response = await axios.post('http://ai-microservice:8000/predict', {
      budget,
      audienceSize,
      industry
    });

    res.json(response.data);
  } catch (error) {
    logger.error('Predict campaign error:', error);
    res.status(500).json({ error: 'Failed to predict campaign' });
  }
};

exports.analyzeProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let analysis;
    if (project.type === 'design') {
      analysis = await aiDesignService.analyzeDesign(project.files);
    } else if (project.type === 'marketing') {
      analysis = await aiMarketingService.analyzeCampaign(project.id);
    }

    res.json(analysis);
  } catch (error) {
    logger.error('Analyze project error:', error);
    res.status(500).json({ error: 'Failed to analyze project' });
  }
};
