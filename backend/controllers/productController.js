const db = require('../config/db');
const { deleteUploadedFile } = require('../middleware/upload');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const resolveFileUrls = async (files) => {
  if (!files || files.length === 0) return [];
  const useCloudinary = isCloudinaryConfigured();
  const urls = [];

  for (const file of files) {
    if (useCloudinary) {
      try {
        const cResult = await uploadToCloudinary(file.path);
        if (cResult && cResult.url) {
          urls.push(cResult.url);
          continue;
        }
      } catch (err) {
        console.error('Cloudinary upload fallback to local:', err.message);
      }
    }
    urls.push(`/uploads/${file.filename}`);
  }
  return urls;
};

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category, search, inStock } = req.query;

    let products = db.findAll('products');

    if (category && category !== 'All' && category !== 'All Construction Materials') {
      products = products.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.variety && p.variety.toLowerCase().includes(q))
      );
    }

    if (inStock !== undefined) {
      const isStockTrue = inStock === 'true';
      products = products.filter((p) => Boolean(p.inStock) === isStockTrue);
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products.',
      error: err.message,
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = db.findById('products', id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product.',
      error: err.message,
    });
  }
};

// POST /api/products (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      unit,
      variety,
      badge,
      description,
      specs,
      inStock,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required fields.',
      });
    }

    // Process uploaded images
    let images = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      images = await resolveFileUrls(req.files);
    } else if (req.file) {
      images = await resolveFileUrls([req.file]);
    } else if (req.body.image) {
      images = [req.body.image];
    } else if (req.body.images) {
      images = Array.isArray(req.body.images)
        ? req.body.images
        : typeof req.body.images === 'string'
        ? req.body.images.split(',').map((s) => s.trim())
        : [];
    }

    // Format specs
    let parsedSpecs = [];
    if (Array.isArray(specs)) {
      parsedSpecs = specs;
    } else if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch {
        parsedSpecs = specs
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const newProduct = db.insert('products', {
      name: name.trim(),
      category: category.trim(),
      price: price.trim(),
      unit: unit ? unit.trim() : 'Per Unit',
      variety: variety ? variety.trim() : '',
      badge: badge ? badge.trim() : 'VERIFIED GRADE',
      description: description ? description.trim() : '',
      images,
      specs: parsedSpecs,
      inStock: inStock !== undefined ? inStock === 'true' || inStock === true : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
      error: err.message,
    });
  }
};

// PUT /api/products/:id (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('products', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
    }

    const {
      name,
      category,
      price,
      unit,
      variety,
      badge,
      description,
      specs,
      inStock,
      removeOldPhotos,
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (category !== undefined) updates.category = category.trim();
    if (price !== undefined) updates.price = price.trim();
    if (unit !== undefined) updates.unit = unit.trim();
    if (variety !== undefined) updates.variety = variety.trim();
    if (badge !== undefined) updates.badge = badge.trim();
    if (description !== undefined) updates.description = description.trim();
    if (inStock !== undefined) updates.inStock = inStock === 'true' || inStock === true;

    if (specs !== undefined) {
      if (Array.isArray(specs)) {
        updates.specs = specs;
      } else if (typeof specs === 'string') {
        try {
          updates.specs = JSON.parse(specs);
        } catch {
          updates.specs = specs
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    }

    // Handle new images if uploaded
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = await resolveFileUrls(req.files);
      if (removeOldPhotos === 'true' || removeOldPhotos === true) {
        // delete old uploaded images
        (existing.images || []).forEach((img) => deleteUploadedFile(img));
        updates.images = newImages;
      } else {
        // Place newly uploaded photos first so the latest uploaded image becomes the primary card image
        updates.images = [...newImages, ...(existing.images || [])];
      }
    } else if (req.file) {
      const [newImg] = await resolveFileUrls([req.file]);
      if (removeOldPhotos === 'true' || removeOldPhotos === true) {
        (existing.images || []).forEach((img) => deleteUploadedFile(img));
        updates.images = [newImg];
      } else {
        updates.images = [newImg, ...(existing.images || [])];
      }
    } else if (req.body.images && Array.isArray(req.body.images)) {
      updates.images = req.body.images;
    }

    const updated = db.update('products', id, updates);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
      error: err.message,
    });
  }
};

// DELETE /api/products/:id (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('products', id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
    }

    // Clean up uploaded files from disk
    if (Array.isArray(existing.images)) {
      existing.images.forEach((img) => deleteUploadedFile(img));
    }

    db.delete('products', id);

    return res.status(200).json({
      success: true,
      message: `Product '${existing.name}' deleted successfully.`,
      deletedId: id,
    });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: err.message,
    });
  }
};

// POST /api/products/:id/photos - Upload new photo(s) to existing product
const uploadProductPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const product = db.findById('products', id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
    }

    let addedImages = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      addedImages = await resolveFileUrls(req.files);
    } else if (req.file) {
      addedImages = await resolveFileUrls([req.file]);
    } else {
      return res.status(400).json({
        success: false,
        message: 'No photo file provided for upload.',
      });
    }

    const currentImages = product.images || [];
    const updatedImages = [...currentImages, ...addedImages];

    const updated = db.update('products', id, { images: updatedImages });

    return res.status(200).json({
      success: true,
      message: 'Photo(s) uploaded and added to product successfully.',
      images: updated.images,
      added: addedImages,
    });
  } catch (err) {
    console.error('Upload photo error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload product photo.',
      error: err.message,
    });
  }
};

// PUT /api/products/:id/photos - Change / Replace a specific photo
const replaceProductPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPhotoUrl, index } = req.body;
    const product = db.findById('products', id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'A replacement photo file is required.',
      });
    }

    const [newPhotoUrl] = await resolveFileUrls([req.file]);
    let images = [...(product.images || [])];

    let targetIndex = -1;
    if (index !== undefined && !isNaN(Number(index))) {
      targetIndex = Number(index);
    } else if (oldPhotoUrl) {
      targetIndex = images.indexOf(oldPhotoUrl);
    }

    if (targetIndex >= 0 && targetIndex < images.length) {
      const removedOld = images[targetIndex];
      deleteUploadedFile(removedOld);
      images[targetIndex] = newPhotoUrl;
    } else {
      // If photo not found in list, append it
      images.push(newPhotoUrl);
    }

    const updated = db.update('products', id, { images });

    return res.status(200).json({
      success: true,
      message: 'Product photo replaced successfully.',
      images: updated.images,
      newPhotoUrl,
    });
  } catch (err) {
    console.error('Replace photo error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to replace product photo.',
      error: err.message,
    });
  }
};

// DELETE /api/products/:id/photos - Delete a specific photo
const deleteProductPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photoUrl = req.body?.photoUrl || req.query?.photoUrl;
    const rawIndex = req.body?.index !== undefined ? req.body.index : req.query?.index;
    const product = db.findById('products', id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
    }

    let images = [...(product.images || [])];
    let removedPhoto = null;

    if (photoUrl) {
      const foundIdx = images.indexOf(photoUrl);
      if (foundIdx !== -1) {
        removedPhoto = images.splice(foundIdx, 1)[0];
      }
    } else if (rawIndex !== undefined && !isNaN(Number(rawIndex))) {
      const targetIdx = Number(rawIndex);
      if (targetIdx >= 0 && targetIdx < images.length) {
        removedPhoto = images.splice(targetIdx, 1)[0];
      }
    }

    if (!removedPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Photo to delete was not found on this product.',
      });
    }

    // Delete file from disk if it was an uploaded file
    deleteUploadedFile(removedPhoto);

    const updated = db.update('products', id, { images });

    return res.status(200).json({
      success: true,
      message: 'Product photo deleted successfully.',
      deletedPhoto: removedPhoto,
      images: updated.images,
    });
  } catch (err) {
    console.error('Delete photo error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product photo.',
      error: err.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  replaceProductPhoto,
  deleteProductPhoto,
};
