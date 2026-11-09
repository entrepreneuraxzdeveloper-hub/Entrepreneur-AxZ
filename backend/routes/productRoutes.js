const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadMultiple, uploadSingle } = require('../middleware/upload');

// Public endpoints
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-protected CRUD endpoints
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  uploadMultiple,
  productController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  uploadMultiple,
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  productController.deleteProduct
);

// Photo management endpoints
router.post(
  '/:id/photos',
  authenticateToken,
  requireAdmin,
  uploadMultiple,
  productController.uploadProductPhoto
);

router.put(
  '/:id/photos',
  authenticateToken,
  requireAdmin,
  uploadSingle,
  productController.replaceProductPhoto
);

router.delete(
  '/:id/photos',
  authenticateToken,
  requireAdmin,
  productController.deleteProductPhoto
);

module.exports = router;

