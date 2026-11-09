const db = require('../config/db');

// @desc    Get company & depot details
// @route   GET /api/company
// @access  Public
exports.getCompany = async (req, res) => {
  try {
    const company = db.getCompany();
    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving company details',
    });
  }
};

// @desc    Update company & depot details
// @route   PUT /api/company
// @access  Public (or Protected Admin)
exports.updateCompany = async (req, res) => {
  try {
    const {
      facilityName,
      operatingSchedule,
      hotline,
      hotlineSubtitle,
      coverageRegion,
      materialsGuarantee,
      email,
      director,
      brandName,
      parentCompany,
    } = req.body;

    const updates = {};
    if (facilityName !== undefined) updates.facilityName = facilityName.trim();
    if (operatingSchedule !== undefined) updates.operatingSchedule = operatingSchedule.trim();
    if (hotline !== undefined) updates.hotline = hotline.trim();
    if (hotlineSubtitle !== undefined) updates.hotlineSubtitle = hotlineSubtitle.trim();
    if (coverageRegion !== undefined) updates.coverageRegion = coverageRegion.trim();
    if (materialsGuarantee !== undefined) updates.materialsGuarantee = materialsGuarantee.trim();
    if (email !== undefined) updates.email = email.trim();
    if (director !== undefined) updates.director = director.trim();
    if (brandName !== undefined) updates.brandName = brandName.trim();
    if (parentCompany !== undefined) updates.parentCompany = parentCompany.trim();

    const updated = db.updateCompany(updates);

    res.json({
      success: true,
      data: updated,
      message: 'Company depot details updated successfully',
    });
  } catch (error) {
    console.error('Error updating company details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating company details',
    });
  }
};

