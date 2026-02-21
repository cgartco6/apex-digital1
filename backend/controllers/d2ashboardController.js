const { Project, Payout, CampaignMetric } = require('../models');
const { Op } = require('sequelize');

// Get all projects for the authenticated user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payout history and current retained balance
exports.getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.findAll({
      where: { userId: req.user.id },
      order: [['weekStart', 'DESC']]
    });

    // Calculate current balance from retained earnings
    // In a real system, you'd sum the retained portion from all payouts
    const totalRetained = payouts.reduce((acc, p) => acc + parseFloat(p.breakdown.retained || 0), 0);

    res.json({
      payouts,
      currentBalance: {
        retained: totalRetained,
        // You could also add other buckets if needed
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get campaign analytics for the user's marketing projects
exports.getAnalytics = async (req, res) => {
  try {
    // Find all marketing projects for this user
    const projects = await Project.findAll({
      where: { userId: req.user.id, type: 'marketing' },
      attributes: ['id']
    });
    const projectIds = projects.map(p => p.id);

    const metrics = await CampaignMetric.findAll({
      where: { projectId: projectIds },
      order: [['date', 'ASC']]
    });

    // Aggregate if needed
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
