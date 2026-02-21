const { Project, Payout, CampaignMetric } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(projects);
  } catch (error) {
    logger.error('Get dashboard projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

exports.getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.findAll({
      where: { userId: req.user.id },
      order: [['weekStart', 'DESC']]
    });

    const totalRetained = payouts.reduce(
      (acc, p) => acc + parseFloat(p.breakdown.retained || 0),
      0
    );

    res.json({
      payouts,
      currentBalance: { retained: totalRetained }
    });
  } catch (error) {
    logger.error('Get dashboard payouts error:', error);
    res.status(500).json({ error: 'Failed to get payouts' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        userId: req.user.id,
        type: 'marketing'
      },
      attributes: ['id']
    });

    const projectIds = projects.map(p => p.id);

    const metrics = await CampaignMetric.findAll({
      where: {
        projectId: projectIds,
        date: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      order: [['date', 'ASC']]
    });

    res.json(metrics);
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};
