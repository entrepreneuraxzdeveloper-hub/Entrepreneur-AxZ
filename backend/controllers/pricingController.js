const db = require('../config/db');

// Helper to format currency
const formatBenchmarkRate = (rate) => {
  if (!rate) return '';
  let cleaned = rate.trim();
  if (/^\d/.test(cleaned) && !cleaned.startsWith('₹')) {
    cleaned = `₹${cleaned}`;
  }
  return cleaned;
};

// GET /api/pricing-table (Public)
const getAllPricing = async (req, res) => {
  try {
    const { items, footerNote } = db.getPricingTable();
    return res.status(200).json({
      success: true,
      count: items.length,
      items,
      footerNote,
    });
  } catch (err) {
    console.error('Get pricing table error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve pricing table.',
      error: err.message,
    });
  }
};

// POST /api/pricing-table (Admin only)
const createPricingRow = async (req, res) => {
  try {
    const { description, tag, standardUnit, brandVariety, benchmarkRate, order } = req.body;

    if (!description || !benchmarkRate) {
      return res.status(400).json({
        success: false,
        message: 'Description and Benchmark Rate are required fields.',
      });
    }

    const { items } = db.getPricingTable();
    const nextOrder = order !== undefined ? Number(order) : items.length + 1;

    const newRow = db.insert('pricingTable', {
      description: description.trim(),
      tag: tag ? tag.trim() : '',
      standardUnit: standardUnit ? standardUnit.trim() : 'Per Unit',
      brandVariety: brandVariety ? brandVariety.trim() : 'Standard Wholesale Grade',
      benchmarkRate: formatBenchmarkRate(benchmarkRate),
      order: nextOrder,
    });

    return res.status(201).json({
      success: true,
      message: 'Pricing benchmark row added successfully.',
      item: newRow,
    });
  } catch (err) {
    console.error('Create pricing row error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create pricing row.',
      error: err.message,
    });
  }
};

// PUT /api/pricing-table/:id (Admin only)
const updatePricingRow = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('pricingTable', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Pricing row with ID '${id}' not found.`,
      });
    }

    const { description, tag, standardUnit, brandVariety, benchmarkRate, order } = req.body;
    const updates = {};

    if (description !== undefined) updates.description = description.trim();
    if (tag !== undefined) updates.tag = tag.trim();
    if (standardUnit !== undefined) updates.standardUnit = standardUnit.trim();
    if (brandVariety !== undefined) updates.brandVariety = brandVariety.trim();
    if (benchmarkRate !== undefined) updates.benchmarkRate = formatBenchmarkRate(benchmarkRate);
    if (order !== undefined) updates.order = Number(order);

    const updated = db.update('pricingTable', id, updates);

    return res.status(200).json({
      success: true,
      message: 'Pricing benchmark row updated successfully.',
      item: updated,
    });
  } catch (err) {
    console.error('Update pricing row error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update pricing row.',
      error: err.message,
    });
  }
};

// DELETE /api/pricing-table/:id (Admin only)
const deletePricingRow = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('pricingTable', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Pricing row with ID '${id}' not found.`,
      });
    }

    db.delete('pricingTable', id);

    return res.status(200).json({
      success: true,
      message: `Pricing row '${existing.description}' deleted successfully.`,
    });
  } catch (err) {
    console.error('Delete pricing row error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete pricing row.',
      error: err.message,
    });
  }
};

// PUT /api/pricing-table/note (Admin only)
const updatePricingNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (note === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Disclaimer note is required.',
      });
    }

    const updatedNote = db.updatePricingNote(note.trim());

    return res.status(200).json({
      success: true,
      message: 'Pricing table disclaimer note updated.',
      note: updatedNote,
    });
  } catch (err) {
    console.error('Update pricing note error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update disclaimer note.',
      error: err.message,
    });
  }
};

module.exports = {
  getAllPricing,
  createPricingRow,
  updatePricingRow,
  deletePricingRow,
  updatePricingNote,
};

