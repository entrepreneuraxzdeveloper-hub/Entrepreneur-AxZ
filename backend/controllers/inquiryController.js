const db = require('../config/db');

// GET /api/inquiries (Admin)
const getAllInquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    let list = db.findAll('inquiries');

    if (status && status !== 'All') {
      list = list.filter(
        (inq) => inq.status && inq.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (inq) =>
          (inq.name && inq.name.toLowerCase().includes(q)) ||
          (inq.phone && inq.phone.toLowerCase().includes(q)) ||
          (inq.location && inq.location.toLowerCase().includes(q)) ||
          (inq.material && inq.material.toLowerCase().includes(q)) ||
          (inq.message && inq.message.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: list.length,
      inquiries: list,
    });
  } catch (err) {
    console.error('Get inquiries error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inquiries.',
      error: err.message,
    });
  }
};

// GET /api/inquiries/:id
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = db.findById('inquiries', id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: `Inquiry with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      inquiry,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inquiry.',
      error: err.message,
    });
  }
};

// POST /api/inquiries (Public from website quotation form)
const createInquiry = async (req, res) => {
  try {
    const { name, phone, material, location, message, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required to submit a quotation request.',
      });
    }

    const newInquiry = db.insert('inquiries', {
      name: String(name).trim(),
      phone: String(phone).trim(),
      material: material ? String(material).trim() : 'All Materials (Complete Site)',
      location: location ? String(location).trim() : 'Howrah, West Bengal',
      message: message ? String(message).trim() : '',
      status: 'pending',
      source: source || 'Website Quotation Form',
      notes: '',
    });

    return res.status(201).json({
      success: true,
      message: 'Quotation request received! Our site coordinator will contact you shortly.',
      inquiry: newInquiry,
    });
  } catch (err) {
    console.error('Create inquiry error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save quotation request.',
      error: err.message,
    });
  }
};

// PUT /api/inquiries/:id (Update status / notes)
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = db.findById('inquiries', id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Inquiry with ID '${id}' not found.`,
      });
    }

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const updated = db.update('inquiries', id, updates);

    return res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully.',
      inquiry: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update inquiry.',
      error: err.message,
    });
  }
};

// DELETE /api/inquiries/:id
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('inquiries', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Inquiry with ID '${id}' not found.`,
      });
    }

    db.delete('inquiries', id);

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry.',
      error: err.message,
    });
  }
};

module.exports = {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
};

