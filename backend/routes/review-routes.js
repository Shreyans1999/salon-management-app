const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review-controller');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin-auth');

router.post(
  '/',
  auth.authenticate,
  reviewController.createReview
);

router.put(
  '/:id/response',
  [auth.authenticate, adminAuth.isAdmin],
  reviewController.addStaffResponse
);

module.exports = router;