const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service-controller');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin-auth');

router.post(
  '/',
  [auth.authenticate, adminAuth.isAdmin],
  serviceController.createService
);

router.get('/', serviceController.getAllServices);

router.put(
  '/:id',
  [auth.authenticate, adminAuth.isAdmin],
  serviceController.updateService
);

module.exports = router;