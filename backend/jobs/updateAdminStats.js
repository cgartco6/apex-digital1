const cron = require('node-cron');
const { AdminStats, User, Payment, Project } = require('../models');
const { Op } = require('sequelize');

cron.schedule('0 0 * * *', async () => { // every day at midnight
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const totalClients = await User.count({ where: { role: 'client' } });
  const newClientsToday = await User.count({
    where: { role: 'client', createdAt: { [Op.gte]: yesterday } }
  });
  const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } });
  const revenueToday = await Payment.sum('amount', {
    where: { status: 'completed', createdAt: { [Op.gte]: yesterday } }
  });
  const pendingPayouts = await Payout.sum('totalAmount', { where: { status: 'pending' } });
  const completedProjects = await Project.count({ where: { status: 'delivered' } });
  const activeProjects = await Project.count({ where: { status: { [Op.notIn]: ['delivered', 'cancelled'] } } });

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
});
