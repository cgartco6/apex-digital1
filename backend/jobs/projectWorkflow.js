const Queue = require('bull');
const projectQueue = new Queue('project workflow', process.env.REDIS_URL);
const { Project } = require('../models');
const aiDesign = require('../services/aiDesignService');
const aiMarketing = require('../services/aiMarketingService');

projectQueue.process(async (job) => {
  const { projectId } = job.data;
  const project = await Project.findByPk(projectId);
  if (!project) return;

  // Step 1: AI Processing
  if (project.type === 'design') {
    const designUrl = await aiDesign.generateDesign(project.requirements, project.style);
    project.files = { designUrl };
    project.status = 'proof_check';
  } else if (project.type === 'marketing') {
    const strategy = await aiMarketing.createStrategy(project);
    project.files = { strategy };
    project.status = 'proof_check';
  }
  await project.save();

  // Step 2: Wait for client approval (handled by frontend)
  // If auto-approved (basic package), move to delivered
  if (project.package === 'basic') {
    project.status = 'delivered';
    await project.save();
  }
});
