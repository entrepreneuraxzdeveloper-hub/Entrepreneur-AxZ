const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { deleteFromCloudinary } = require('../config/cloudinary');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif|svg\+xml|svg/;
  const allowedVideoTypes = /mp4|webm|ogg|mov|mkv|quicktime/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  const isImg = allowedImageTypes.test(ext) || allowedImageTypes.test(mime);
  const isVid = allowedVideoTypes.test(ext) || allowedVideoTypes.test(mime);

  if (isImg || isVid) {
    cb(null, true);
  } else {
    cb(new Error('Only image (JPEG, PNG, WEBP, GIF, SVG) and video (MP4, WEBM, MOV) files are supported!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for images & videos
  fileFilter,
});

// Helper to safely delete an uploaded file from local or Cloudinary
const deleteUploadedFile = async (filePath) => {
  if (!filePath) return false;
  if (filePath.includes('cloudinary.com')) {
    return await deleteFromCloudinary(filePath);
  }
  try {
    let cleanPath = filePath;
    if (filePath.startsWith('/uploads/')) {
      cleanPath = filePath.replace('/uploads/', '');
    } else if (filePath.startsWith('uploads/')) {
      cleanPath = filePath.replace('uploads/', '');
    }

    const fullPath = path.join(UPLOADS_DIR, path.basename(cleanPath));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch (err) {
    console.error('Failed to delete file from uploads:', filePath, err);
  }
  return false;
};

module.exports = {
  uploadSingle: upload.single('image'),
  uploadMultiple: upload.array('images', 10),
  uploadMedia: upload.single('media'),
  uploadAny: upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'media', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),
  deleteUploadedFile,
  UPLOADS_DIR,
};

