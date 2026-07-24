const { Router } = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { upload } = require('../../lib/upload');
const { createThesisSchema } = require('./thesis.schema');
const {
  createThesis,
  listTheses,
  getThesis,
  submitVersion,
  submitToSupervisor,
  startReview,
  approve,
  requestRevisions,
  reopenThesis,
} = require('./thesis.controller');

const router = Router();

// Wrap multer middleware so Cloudinary/Multer errors are caught and returned as JSON
function handleUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}

// Student actions
router.post('/', requireAuth, requireRole('student'), validate(createThesisSchema), createThesis);
router.post('/:id/submissions', requireAuth, requireRole('student'), submitVersion);
router.post('/:id/submissions/upload', requireAuth, requireRole('student'), handleUpload, submitVersion);
router.post('/:id/submit', requireAuth, requireRole('student'), submitToSupervisor);

// Shared view actions (student, supervisor, coordinator)
router.get('/', requireAuth, listTheses);
router.get('/:id', requireAuth, getThesis);

// Supervisor review actions
router.post('/:id/start-review', requireAuth, requireRole('supervisor'), startReview);
router.post('/:id/approve', requireAuth, requireRole('supervisor'), approve);
router.post('/:id/request-revisions', requireAuth, requireRole('supervisor'), requestRevisions);

// Coordinator override actions
router.post('/:id/reopen', requireAuth, requireRole('coordinator'), reopenThesis);

module.exports = router;
