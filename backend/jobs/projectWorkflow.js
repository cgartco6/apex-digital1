const Queue = require('bull');
const { Project } = require('../models');
const aiDesignService = require('../services/aiDesignService');
const aiMarketingService = require('../services/aiMarketingService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const projectQueue = new Queue('project workflow', process.env.REDIS_URL);

projectQueue.process(async (job) => {
  const { projectId } = job.data;
  
  try {
    const project = await Project.findByPk(projectId, {
      include: ['User']
    });

    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    logger.info(`Processing project ${projectId}, status: ${project.status}`);

    // Step 1: AI Processing
    if (project.status === 'ai_processing') {
      await handleAIProcessing(project);
    }
    
    // Step 2: Proof Check (if not auto-approved)
    else if (project.status === 'proof_check') {
      await handleProofCheck(project);
    }
    
    // Step 3: Delivery
    else if (project.status === 'delivered') {
      await handleDelivery(project);
    }

  } catch (error) {
    logger.error(`Project workflow error for ${projectId}:`, error);
    throw error;
  }
});

async function handleAIProcessing(project) {
  project.progress = 25;
  await project.save();

  let files = {};

  if (project.type === 'design' || project.type === 'web' || 
      project.type === 'landing' || project.type === 'ecommerce') {
    // Generate design
    const designUrl = await aiDesignService.generateDesign(
      project.requirements,
      project.style
    );
    files.design = designUrl;

    // Generate variations for higher packages
    if (project.package !== 'basic') {
      const variations = await aiDesignService.generateVariations(designUrl, 3);
      files.variations = variations;
    }

    // Generate mockups for applicable products
    if (project.type === 'design') {
      const mockup = await aiDesignService.generateMockup(designUrl, project.style);
      files.mockup = mockup.mockupUrl;
    }
  } 
  else if (project.type === 'marketing') {
    // Generate marketing strategy
    const strategy = await aiMarketingService.createStrategy(project);
    files.strategy = strategy;

    // Generate ad copy
    const adCopy = await aiMarketingService.generateAdCopy(
      project.requirements,
      'target audience',
      'professional'
    );
    files.adCopy = adCopy;
  }

  project.files = files;
  project.progress = 75;

  // Auto-approve for basic package
  if (project.package === 'basic') {
    project.status = 'delivered';
    project.progress = 100;
    project.deliveredAt = new Date();
  } else {
    project.status = 'proof_check';
  }

  await project.save();

  // Send notification
  await emailService.sendProjectStatusUpdate(project, project.User);
}

async function handleProofCheck(project) {
  // Wait for client approval (handled by frontend)
  // This job will be re-triggered when client approves
  project.progress = 90;
  await project.save();
}

async function handleDelivery(project) {
  project.progress = 100;
  project.status = 'completed';
  project.deliveredAt = project.deliveredAt || new Date();
  await project.save();

  // Send completion email
  await emailService.sendProjectStatusUpdate(project, project.User);

  // If marketing project, start tracking
  if (project.type === 'marketing') {
    await startCampaignTracking(project);
  }
}

async function startCampaignTracking(project) {
  // Initialize campaign tracking
  // This would set up webhooks from ad platforms
  const { CampaignMetric } = require('../models');
  
  // Create initial metric record
  await CampaignMetric.create({
    projectId: project.id,
    date: new Date(),
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0,
    revenue: 0
  });
}

module.exports = projectQueue;
