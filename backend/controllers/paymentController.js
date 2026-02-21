const { Payment, Project } = require('../models');
const stripeService = require('../services/stripeService');
const payfastService = require('../services/payfastService');
const cryptoService = require('../services/cryptoService');
const { projectQueue } = require('../queue/bull');
const logger = require('../utils/logger');
const paypalService = require('../services/paypalService');
const eftService = require('../services/eftService');

// Inside createPaymentIntent switch
case 'paypal':
  paymentIntent = await paypalService.createOrder(project.price, currency, { projectId, userId: req.user.id });
  response = { orderId: paymentIntent.id, approvalUrl: paymentIntent.links.find(l => l.rel === 'approve').href };
  break;

case 'eft':
  const reference = eftService.generateReference(projectId, req.user.id);
  response = { bankDetails: eftService.getBankDetails(reference), reference };
  break;

exports.createPaymentIntent = async (req, res) => {
  try {
    const { projectId, method, currency = 'ZAR' } = req.body;

    const project = await Project.findOne({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let paymentIntent;
    let response;

    switch (method) {
      case 'stripe':
        paymentIntent = await stripeService.createPaymentIntent(
          project.price,
          currency,
          { projectId, userId: req.user.id }
        );
        response = {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        };
        break;

      case 'payfast':
        paymentIntent = payfastService.generatePaymentForm(project);
        response = { form: paymentIntent };
        break;

      case 'crypto':
        paymentIntent = await cryptoService.createInvoice(
          project.price,
          currency,
          { projectId, userId: req.user.id }
        );
        response = { invoice: paymentIntent };
        break;

      default:
        return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Create payment record
    await Payment.create({
      userId: req.user.id,
      projectId: project.id,
      amount: project.price,
      currency,
      method,
      status: 'pending',
      gatewayTransactionId: paymentIntent.id,
      metadata: response
    });

    res.json(response);
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, method } = req.body;

    const payment = await Payment.findOne({
      where: { gatewayTransactionId: paymentIntentId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    let confirmed;
    switch (method) {
      case 'stripe':
        confirmed = await stripeService.confirmPayment(paymentIntentId);
        break;
      case 'payfast':
        // PayFast sends ITN separately
        confirmed = true;
        break;
      case 'crypto':
        confirmed = await cryptoService.verifyPayment(paymentIntentId);
        break;
    }

    if (confirmed) {
      await payment.update({ status: 'completed', paidAt: new Date() });
      
      // Update project status and trigger workflow
      await Project.update(
        { paymentStatus: 'paid', status: 'ai_processing' },
        { where: { id: payment.projectId } }
      );

      // Add to queue for AI processing
      await projectQueue.add('processProject', {
        projectId: payment.projectId
      });

      res.json({ message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ error: 'Payment confirmation failed' });
    }
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Project, attributes: ['type', 'package'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    logger.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [Project]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};
