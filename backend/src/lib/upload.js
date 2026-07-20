const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Local disk storage for uploaded thesis files. Swap this single engine for a
// Cloudinary/S3 storage adapter later — the rest of the upload flow is unchanged.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // Unique, safe filename: <random>-<timestamp>.<ext>
    const ext = path.extname(file.originalname).toLowerCase();
    const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}${ext}`);
  },
});

const ALLOWED = ['.pdf', '.docx'];

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) {
      return cb(new Error('Only .pdf and .docx files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = { upload, UPLOAD_DIR };
