const path = require('path');
const fs = require('fs');
const multer = require('multer');

let storage;

// Check if Cloudinary credentials are provided in environment variables
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      return {
        folder: 'thesisflow_documents',
        resource_type: 'raw', // RAW resource type for PDF and DOCX files
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`,
      };
    },
  });
  console.log('☁️ File Storage: Cloudinary (Cloud Active)');
} else {
  // Local fallback storage for development
  const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${base}${ext}`);
    },
  });
  console.log('📁 File Storage: Local Disk (uploads/)');
}

const ALLOWED = ['.pdf', '.docx'];

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) {
      return cb(new Error('Only .pdf and .docx files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = { upload };
