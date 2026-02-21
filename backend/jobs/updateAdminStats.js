const cron = require('node-cron');
const { AdminStats, User, Payment, Project, Payout } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  await updateAdminStats();
});

async function updateAdminStats() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Calculate stats
    const totalClients = await User.count({ where: { role: 'client' } });
    
    const newClientsToday = await User.count({
      where: {
        role: 'client',
        createdAt: { [Op.gte]: yesterday }
      }
    });

    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    const revenueToday = await Payment.sum('amount', {
      where: {
        status: 'completed',
        paidAt: { [Op.gte]: yesterday }
      }
    }) || 0;

    const pendingPayouts = await Payout.sum('totalAmount', {
      where: { status: 'pending' }
    }) || 0;

    const completedProjects = await Project.count({
      where: { status: 'completed' }
    });

    const activeProjects = await Project.count({
      where: {
        status: {
          [Op.notIn]: ['completed', 'cancelled', 'delivered']
        }
      }
    });

    // Upsert stats
    await AdminStats.upsert({
      date: today,
      totalClients,
      newClientsToday,
      totalRevenue,
      revenueToday,
      pendingPayouts,
      completedProjects,
      activeProjects
    });

    logger.info('Admin stats updated successfully');

  } catch (error) {
    logger.error('Failed to update admin stats:', error);
  }
}

module.exports = { updateAdminStats };
