const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public route to view benchmark pricing on website & admin
router.get('/', pricingController.getAllPricing);

// Admin-protected routes to edit benchmark pricing
router.post('/', authenticateToken, requireAdmin, pricingController.createPricingRow);
router.put('/note', authenticateToken, requireAdmin, pricingController.updatePricingNote);
router.put('/:id', authenticateToken, requireAdmin, pricingController.updatePricingRow);
router.delete('/:id', authenticateToken, requireAdmin, pricingController.deletePricingRow);

module.exports = router;

