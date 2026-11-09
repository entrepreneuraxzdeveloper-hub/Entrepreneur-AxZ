const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// POST /api/upload - Single media upload (images or videos)
router.post('/', authenticateToken, requireAdmin, uploadSingle, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No media file provided for upload.',
    });
  }

  try {
    let fileUrl = `/uploads/${req.file.filename}`;
    let cloudinaryData = null;

    if (isCloudinaryConfigured()) {
      cloudinaryData = await uploadToCloudinary(req.file.path);
      if (cloudinaryData && cloudinaryData.url) {
        fileUrl = cloudinaryData.url;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Media uploaded successfully.',
      provider: cloudinaryData ? 'cloudinary' : 'local',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        cloudinary: cloudinaryData,
      },
    });
  } catch (err) {
    console.error('Upload processing error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process media upload.',
      error: err.message,
    });
  }
});

// POST /api/upload/multiple - Batch media upload
router.post('/multiple', authenticateToken, requireAdmin, uploadMultiple, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files provided for batch upload.',
    });
  }

  try {
    const uploadedFiles = [];
    const useCloudinary = isCloudinaryConfigured();

    for (const file of req.files) {
      let fileUrl = `/uploads/${file.filename}`;
      let cData = null;

      if (useCloudinary) {
        cData = await uploadToCloudinary(file.path);
        if (cData && cData.url) {
          fileUrl = cData.url;
        }
      }

      uploadedFiles.push({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        cloudinary: cData,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully.`,
      provider: useCloudinary ? 'cloudinary' : 'local',
      files: uploadedFiles,
      urls: uploadedFiles.map((f) => f.url),
    });
  } catch (err) {
    console.error('Batch upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload batch files.',
      error: err.message,
    });
  }
});

module.exports = router;
