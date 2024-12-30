const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment-controller');
const auth = require('../middleware/auth');

router.post(
  '/create',
  auth.authenticate,
  appointmentController.createAppointment
);

router.get(
  '/',
  auth.authenticate,
  appointmentController.getAppointments
);

router.put(
  '/cancel/:id',
  auth.authenticate,
  appointmentController.cancelAppointment
);

module.exports = router;