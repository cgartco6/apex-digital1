const { AdminStats, User, Payment, Payout } = require('../models');
const { getTargetProgress } = require('../services/aiTargetService');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
  try {
    // Real‑time stats
    const totalClients = await User.count({ where: { role: 'client' } });
    const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } });
    const pendingPayouts = await Payout.sum('totalAmount', { where: { status: 'pending' } });
    const activeProjects = await Project.count({ where: { status: { [Op.notIn]: ['delivered', 'cancelled'] } } });

    // Historical stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const stats = await AdminStats.findAll({
      where: { date: { [Op.gte]: thirtyDaysAgo } },
      order: [['date', 'ASC']]
    });

    // AI Target Engine
    const targetData = await getTargetProgress();

    res.json({
      current: { totalClients, totalRevenue, pendingPayouts, activeProjects },
      historical: stats,
      target: targetData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
