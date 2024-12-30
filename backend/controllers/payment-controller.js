const Payment = require('../models/payment');
const Appointment = require('../models/appointment');
const stripe = require('../services/payment-gateway');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findByPk(appointmentId, {
      include: ['Service']
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const paymentIntent = await stripe.createPaymentIntent(
      appointment.Service.price
    );

    const payment = await Payment.create({
      UserId: req.user.id,
      AppointmentId: appointmentId,
      amount: appointment.Service.price,
      status: 'pending',
      transactionId: paymentIntent.id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment processing error' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await payment.update({
      status: 'completed'
    });

    // Update appointment status
    await Appointment.update(
      { status: 'confirmed' },
      { where: { id: payment.AppointmentId } }
    );

    res.json({
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};