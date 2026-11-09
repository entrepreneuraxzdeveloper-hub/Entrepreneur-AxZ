const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary using Environment Variables or user provided Cloud Name
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'n49mw097',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

/**
 * Check whether Cloudinary has full API key and Secret credentials
 */
const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'n49mw097';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(cloudName && apiKey && apiSecret);
};

/**
 * Uploads a local image or video file directly to Cloudinary
 * @param {string} filePath - Absolute path to local file on disk
 * @param {object} options - Custom upload options (folder, tags, etc.)
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  if (!isCloudinaryConfigured()) {
    // Return null so calling controllers fall back gracefully to local uploads
    return null;
  }

  try {
    const uploadOptions = {
      folder: options.folder || 'axz_materials',
      resource_type: options.resource_type || 'auto', // Supports images, videos & docs
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Clean up local temp file after upload to Cloudinary
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not delete temporary upload file:', err.message);
      }
    }

    return {
      url: result.secure_url || result.url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (err) {
    console.error('Error uploading media to Cloudinary:', err);
    throw err;
  }
};

/**
 * Delete a media file from Cloudinary
 */
const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!isCloudinaryConfigured() || !publicIdOrUrl) return false;

  try {
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith('http')) {
      const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (match && match[1]) {
        publicId = match[1];
      }
    }

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.warn('Could not delete asset from Cloudinary:', err.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
};

