const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount, currency, metadata) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe payment intent creation failed: ${error.message}`);
  }
};

exports.confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  } catch (error) {
    throw new Error(`Stripe payment confirmation failed: ${error.message}`);
  }
};

exports.createCheckoutSession = async (items, successUrl, cancelUrl) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'zar',
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return session;
  } catch (error) {
    throw new Error(`Stripe checkout session failed: ${error.message}`);
  }
};

exports.createRefund = async (paymentIntentId, amount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined
    });

    return refund;
  } catch (error) {
    throw new Error(`Stripe refund failed: ${error.message}`);
  }
};
