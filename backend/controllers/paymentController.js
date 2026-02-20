const stripe = require('../services/stripeService');
const payfast = require('../services/payfastService');
const crypto = require('../services/cryptoService');
const { Payment, Project } = require('../models');

exports.createPaymentIntent = async (req, res) => {
  const { projectId, method, currency } = req.body;
  const project = await Project.findByPk(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  let paymentIntent;
  if (method === 'stripe') {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(project.price * 100),
      currency,
      metadata: { projectId }
    });
  } else if (method === 'payfast') {
    // Generate PayFast form
    paymentIntent = { url: payfast.generatePaymentUrl(project) };
  } else if (method === 'crypto') {
    paymentIntent = await crypto.createInvoice(project.price, currency);
  }

  res.json({ paymentIntent, clientSecret: paymentIntent?.client_secret });
};

exports.handleWebhook = async (req, res) => {
  // Verify Stripe signature
  const event = req.body;
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Payment.create({
      projectId: paymentIntent.metadata.projectId,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      method: 'stripe',
      status: 'completed',
      gatewayTransactionId: paymentIntent.id
    });
    // Trigger next step in workflow
    require('../queue/bull').add('processProject', { projectId: paymentIntent.metadata.projectId });
  }
  res.json({ received: true });
};
