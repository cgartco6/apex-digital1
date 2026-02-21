const cron = require('node-cron');
const { sequelize, Payout, User, Payment } = require('../models');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Run every Friday at midnight
cron.schedule('0 0 * * 5', async () => {
  await processWeeklyPayouts();
});

async function processWeeklyPayouts() {
  const transaction = await sequelize.transaction();
  
  try {
    logger.info('Starting weekly payout processing');

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - 1);
    weekEnd.setHours(23, 59, 59, 999);

    // Get all completed payments in the last week
    const payments = await Payment.findAll({
      where: {
        status: 'completed',
        paidAt: {
          [sequelize.Op.between]: [weekStart, weekEnd]
        }
      },
      include: ['User'],
      transaction
    });

    // Group by user
    const userTotals = {};
    payments.forEach(payment => {
      if (!userTotals[payment.userId]) {
        userTotals[payment.userId] = {
          total: 0,
          user: payment.User
        };
      }
      userTotals[payment.userId].total += parseFloat(payment.amount);
    });

    // Create payouts for each user
    for (const [userId, data] of Object.entries(userTotals)) {
      const total = data.total;
      
      // Apply platform fee (e.g., 10% retained)
      const netTotal = total * 0.9; // 10% platform fee
      
      const breakdown = {
        fnb: netTotal * 0.35,
        africanBank: netTotal * 0.15,
        aiFnb: netTotal * 0.20,
        reserveFnb: netTotal * 0.20,
        retained: total * 0.10 // Platform fee (never paid out)
      };

      const payout = await Payout.create({
        userId,
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        totalAmount: netTotal,
        breakdown,
        status: 'pending'
      }, { transaction });

      // Send email notification
      await emailService.sendPayoutNotification(payout, data.user);
    }

    await transaction.commit();
    logger.info(`Weekly payouts completed for ${Object.keys(userTotals).length} users`);

  } catch (error) {
    await transaction.rollback();
    logger.error('Weekly payout processing failed:', error);
    throw error;
  }
}

// Also allow manual triggering
module.exports = { processWeeklyPayouts };
