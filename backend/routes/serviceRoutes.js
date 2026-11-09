const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Public endpoints
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Admin-protected CRUD endpoints
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  uploadSingle,
  serviceController.createService
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  uploadSingle,
  serviceController.updateService
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  serviceController.deleteService
);

module.exports = router;

