const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Project } = require('../models');
const { projectQueue } = require('../queue/bull');
const logger = require('../utils/logger');
const crypto = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');

// Set up client
const client = new paypal.core.PayPalHttpClient(environment);

// In webhook handler
const webhookEvent = req.body;
const headers = req.headers;
const verified = await client.execute(new paypal.webhooks.VerifyWebhookSignatureRequest({
  auth_algo: headers['paypal-auth-algo'],
  cert_url: headers['paypal-cert-url'],
  transmission_id: headers['paypal-transmission-id'],
  transmission_sig: headers['paypal-transmission-sig'],
  transmission_time: headers['paypal-transmission-time'],
  webhook_id: process.env.PAYPAL_WEBHOOK_ID,
  webhook_event: webhookEvent
}));

if (verified.result.verification_status !== 'SUCCESS') {
  return res.status(400).send('Invalid signature');
}

exports.payfastWebhook = (req, res) => {
  const { body } = req;
  const signature = body.signature;
  delete body.signature;

  const queryString = Object.keys(body).sort().map(key => `${key}=${encodeURIComponent(body[key]).replace(/%20/g, '+')}`).join('&');
  const calculated = crypto.createHash('md5').update(queryString + '&passphrase=' + process.env.PAYFAST_PASSPHRASE).digest('hex');

  if (calculated !== signature) {
    return res.status(400).send('Invalid signature');
  }

  // Process webhook...
  res.send('OK');
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update payment record
      await Payment.update(
        { status: 'completed', paidAt: new Date() },
        { where: { gatewayTransactionId: paymentIntent.id } }
      );

      // Find project and update
      const payment = await Payment.findOne({
        where: { gatewayTransactionId: paymentIntent.id }
      });

      if (payment) {
        await Project.update(
          { paymentStatus: 'paid', status: 'ai_processing' },
          { where: { id: payment.projectId } }
        );

        // Trigger AI workflow
        await projectQueue.add('processProject', {
          projectId: payment.projectId
        });
      }
      break;

    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;

    default:
      logger.info(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

exports.payfastWebhook = async (req, res) => {
  // PayFast ITN handling
  const { body } = req;
  
  // Verify signature (implement PayFast verification)
  // ...

  if (body.payment_status === 'COMPLETE') {
    await Payment.update(
      { status: 'completed', paidAt: new Date() },
      { where: { gatewayTransactionId: body.m_payment_id } }
    );

    const payment = await Payment.findOne({
      where: { gatewayTransactionId: body.m_payment_id }
    });

    if (payment) {
      await Project.update(
        { paymentStatus: 'paid', status: 'ai_processing' },
        { where: { id: payment.projectId } }
      );

      await projectQueue.add('processProject', {
        projectId: payment.projectId
      });
    }
  }

  res.send('OK');
};

exports.cryptoWebhook = async (req, res) => {
  // Crypto payment confirmation (from Valr or other)
  const { body } = req;

  // Verify webhook signature
  // ...

  if (body.status === 'completed') {
    await Payment.update(
      { status: 'completed', paidAt: new Date() },
      { where: { gatewayTransactionId: body.invoiceId } }
    );

    const payment = await Payment.findOne({
      where: { gatewayTransactionId: body.invoiceId }
    });

    if (payment) {
      await Project.update(
        { paymentStatus: 'paid', status: 'ai_processing' },
        { where: { id: payment.projectId } }
      );

      await projectQueue.add('processProject', {
        projectId: payment.projectId
      });
    }
  }

  res.json({ received: true });
};
