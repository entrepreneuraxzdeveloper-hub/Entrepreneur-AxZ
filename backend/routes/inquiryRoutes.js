const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { verifyToken } = require('../middleware/auth');

// Public route: Frontend quotation form submits here
router.post('/', inquiryController.createInquiry);

// Admin routes: View, update status, and manage inquiries
router.get('/', inquiryController.getAllInquiries);
router.get('/:id', inquiryController.getInquiryById);
router.put('/:id', inquiryController.updateInquiry);
router.delete('/:id', inquiryController.deleteInquiry);

module.exports = router;

