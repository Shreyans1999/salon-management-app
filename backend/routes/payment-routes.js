const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment-controller');
const auth = require('../middleware/auth');

router.post(
  '/create-intent',
  auth.authenticate,
  paymentController.createPaymentIntent
);

router.post(
  '/:paymentId/confirm',
  auth.authenticate,
  paymentController.confirmPayment
);

module.exports = router;