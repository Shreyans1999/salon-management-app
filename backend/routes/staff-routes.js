const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff-controller');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin-auth');

router.post(
  '/',
  [auth.authenticate, adminAuth.isAdmin],
  staffController.createStaff
);

router.get('/', staffController.getAllStaff);

router.put(
  '/:id/availability',
  [auth.authenticate, adminAuth.isAdmin],
  staffController.updateStaffAvailability
);

module.exports = router;