const cron = require('node-cron');
const { sequelize, Payout, User } = require('../models');
const { sendEmail } = require('../services/emailService');

cron.schedule('0 0 * * 5', async () => { // Every Friday at midnight
  const transactions = await sequelize.query(`
    SELECT user_id, SUM(amount) as total
    FROM payments
    WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '7 days'
    GROUP BY user_id
  `, { type: sequelize.QueryTypes.SELECT });

  for (const t of transactions) {
    const total = parseFloat(t.total);
    const breakdown = {
      fnb: total * 0.35,
      africanBank: total * 0.15,
      aiFnb: total * 0.20,
      reserveFnb: total * 0.20,
      retained: total * 0.10
    };
    await Payout.create({
      userId: t.user_id,
      weekStart: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
      weekEnd: new Date(),
      totalAmount: total,
      breakdown,
      status: 'pending'
    });
    // Trigger actual bank transfer via PayFast or crypto
    const user = await User.findByPk(t.user_id);
    sendEmail(user.email, 'Weekly Payout', `Your payout of R${total} is being processed.`);
  }
});
