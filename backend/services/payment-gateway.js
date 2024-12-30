const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd'
    });
    return paymentIntent;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};