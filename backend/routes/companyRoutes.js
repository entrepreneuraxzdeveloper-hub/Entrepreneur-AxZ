const express = require('express');
const router = express.Router();
const { getCompany, updateCompany } = require('../controllers/companyController');

router.route('/')
  .get(getCompany)
  .put(updateCompany);

module.exports = router;

