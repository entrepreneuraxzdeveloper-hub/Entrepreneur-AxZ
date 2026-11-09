const db = require('../config/db');
const { deleteUploadedFile } = require('../middleware/upload');

// GET /api/services
const getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let services = db.findAll('services');

    if (category && category !== 'All') {
      services = services.filter(
        (s) => s.category && s.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      services = services.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.shortDesc && s.shortDesc.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (err) {
    console.error('Get services error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.',
      error: err.message,
    });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = db.findById('services', id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service.',
      error: err.message,
    });
  }
};

// POST /api/services (Admin only)
const createService = async (req, res) => {
  try {
    const { title, shortDesc, description, category, icon, features } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Service title is required.',
      });
    }

    let image = req.body.image || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    let parsedFeatures = [];
    if (Array.isArray(features)) {
      parsedFeatures = features;
    } else if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features
          .split(/[\n,]+/)
          .map((f) => f.trim())
          .filter(Boolean);
      }
    }

    const newService = db.insert('services', {
      title: title.trim(),
      shortDesc: shortDesc ? shortDesc.trim() : '',
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      icon: icon ? icon.trim() : 'briefcase',
      image,
      features: parsedFeatures,
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service: newService,
    });
  } catch (err) {
    console.error('Create service error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: err.message,
    });
  }
};

// PUT /api/services/:id (Admin only)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('services', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Service with ID '${id}' not found.`,
      });
    }

    const { title, shortDesc, description, category, icon, features } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (shortDesc !== undefined) updates.shortDesc = shortDesc.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category.trim();
    if (icon !== undefined) updates.icon = icon.trim();

    if (req.file) {
      deleteUploadedFile(existing.image);
      updates.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updates.image = req.body.image;
    }

    if (features !== undefined) {
      if (Array.isArray(features)) {
        updates.features = features;
      } else if (typeof features === 'string') {
        try {
          updates.features = JSON.parse(features);
        } catch {
          updates.features = features
            .split(/[\n,]+/)
            .map((f) => f.trim())
            .filter(Boolean);
        }
      }
    }

    const updated = db.update('services', id, updates);

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      service: updated,
    });
  } catch (err) {
    console.error('Update service error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: err.message,
    });
  }
};

// DELETE /api/services/:id (Admin only)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('services', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Service with ID '${id}' not found.`,
      });
    }

    if (existing.image) {
      deleteUploadedFile(existing.image);
    }

    db.delete('services', id);

    return res.status(200).json({
      success: true,
      message: `Service '${existing.title}' deleted successfully.`,
      deletedId: id,
    });
  } catch (err) {
    console.error('Delete service error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service.',
      error: err.message,
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};

