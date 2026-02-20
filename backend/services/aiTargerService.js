// Simulates AI‑driven recommendations to reach 5000 paying clients in 10 days
const { AdminStats, User } = require('../models');
const { Op } = require('sequelize');

exports.getTargetProgress = async () => {
  const totalClients = await User.count({ where: { role: 'client' } });
  const target = 5000;
  const daysLeft = 10; // hardcoded for demo – could be dynamic
  const needed = target - totalClients;
  const dailyRate = needed / daysLeft;

  // Get signups in last 7 days
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentSignups = await User.count({
    where: { role: 'client', createdAt: { [Op.gte]: lastWeek } }
  });
  const currentDailyRate = recentSignups / 7;

  // Generate recommendations
  let recommendations = [];
  if (currentDailyRate < dailyRate) {
    recommendations.push('Increase ad spend by 30% on Facebook/Instagram');
    recommendations.push('Launch a limited‑time discount campaign');
    recommendations.push('Activate the AI marketing studio for automated email nurturing');
  } else {
    recommendations.push('Maintain current momentum – you are on track!');
    recommendations.push('Consider upselling existing clients to hit revenue goals');
  }

  // Calculate progress percentage
  const progress = Math.min(100, Math.round((totalClients / target) * 100));

  return {
    totalClients,
    target,
    daysLeft,
    needed,
    dailyRate: dailyRate.toFixed(1),
    currentDailyRate: currentDailyRate.toFixed(1),
    progress,
    recommendations,
    onTrack: currentDailyRate >= dailyRate
  };
};
