const { Payout, User } = require('../models');
const logger = require('../utils/logger');

exports.getPayoutHistory = async (req, res) => {
  try {
    const payouts = await Payout.findAll({
      where: { userId: req.user.id },
      order: [['weekStart', 'DESC']]
    });

    // Calculate current balance from retained earnings
    const totalRetained = payouts.reduce(
      (acc, p) => acc + parseFloat(p.breakdown.retained || 0),
      0
    );

    res.json({
      payouts,
      currentBalance: {
        retained: totalRetained
      }
    });
  } catch (error) {
    logger.error('Get payout history error:', error);
    res.status(500).json({ error: 'Failed to get payout history' });
  }
};

exports.getPayout = async (req, res) => {
  try {
    const payout = await Payout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    res.json(payout);
  } catch (error) {
    logger.error('Get payout error:', error);
    res.status(500).json({ error: 'Failed to get payout' });
  }
};

exports.requestPayout = async (req, res) => {
  try {
    // This would trigger an immediate payout (outside weekly schedule)
    // Usually for retained earnings
    const { amount } = req.body;

    // Implementation depends on payment provider
    // ...

    res.json({ message: 'Payout requested successfully' });
  } catch (error) {
    logger.error('Request payout error:', error);
    res.status(500).json({ error: 'Failed to request payout' });
  }
};
