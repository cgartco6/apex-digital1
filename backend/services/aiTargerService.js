const { User, Project, Payment } = require('../models');
const { Op } = require('sequelize');

exports.getTargetProgress = async () => {
  const totalClients = await User.count({ where: { role: 'client' } });
  const target = 5000;
  const daysLeft = 10;
  const needed = target - totalClients;
  const dailyRate = needed / daysLeft;

  // Get signups in last 7 days
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const recentSignups = await User.count({
    where: { 
      role: 'client', 
      createdAt: { [Op.gte]: lastWeek } 
    }
  });
  
  const currentDailyRate = recentSignups / 7;

  // Get revenue data for recommendations
  const avgRevenuePerClient = await Payment.findOne({
    where: { status: 'completed' },
    attributes: [[sequelize.fn('AVG', sequelize.col('amount')), 'avgAmount']]
  });

  // Generate intelligent recommendations
  const recommendations = [];

  if (currentDailyRate < dailyRate) {
    const gap = dailyRate - currentDailyRate;
    const requiredDailyRevenue = gap * (avgRevenuePerClient?.dataValues?.avgAmount || 1000);

    recommendations.push({
      priority: 'high',
      action: 'Increase ad spend',
      details: `Need ${gap.toFixed(1)} more clients per day (R${requiredDailyRevenue.toFixed(0)} daily revenue)`,
      channels: ['Google Ads', 'Facebook', 'LinkedIn']
    });

    recommendations.push({
      priority: 'medium',
      action: 'Launch referral program',
      details: 'Offer 15% discount for referrals',
      expectedImpact: '10-15% increase in signups'
    });

    recommendations.push({
      priority: 'medium',
      action: 'Limited-time offer',
      details: '30% off first project',
      expectedImpact: '20% conversion boost'
    });

    recommendations.push({
      priority: 'low',
      action: 'Email nurture campaign',
      details: 'Target abandoned carts and prospects',
      expectedImpact: '5-10% recovery rate'
    });
  } else {
    recommendations.push({
      priority: 'high',
      action: 'Maintain momentum',
      details: 'Current rate exceeds target - focus on quality',
      channels: ['Upsell existing clients', 'Referral program']
    });
  }

  // Add channel-specific recommendations
  const channelPerformance = await analyzeChannelPerformance();
  recommendations.push(...channelPerformance);

  const progress = Math.min(100, Math.round((totalClients / target) * 100));

  return {
    totalClients,
    target,
    daysLeft,
    needed,
    dailyRate: parseFloat(dailyRate.toFixed(1)),
    currentDailyRate: parseFloat(currentDailyRate.toFixed(1)),
    progress,
    recommendations,
    onTrack: currentDailyRate >= dailyRate,
    projectedCompletion: currentDailyRate > 0 
      ? Math.ceil((target - totalClients) / currentDailyRate) 
      : null
  };
};

async function analyzeChannelPerformance() {
  // In production, analyze actual ad platform data
  // For demo, return sample insights
  return [
    {
      priority: 'medium',
      action: 'Facebook retargeting',
      details: 'Set up dynamic retargeting for website visitors',
      expectedImpact: '30% higher conversion rate'
    },
    {
      priority: 'medium',
      action: 'Google Search expansion',
      details: 'Add competitor keywords to capture intent',
      expectedImpact: '25% more qualified traffic'
    },
    {
      priority: 'low',
      action: 'LinkedIn content',
      details: 'Share case studies and success stories',
      expectedImpact: 'Build trust and authority'
    }
  ];
    }
