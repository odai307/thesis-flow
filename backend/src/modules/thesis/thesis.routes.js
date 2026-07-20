const path = require('path');
const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { upload } = require('../../lib/upload');
const { createThesisSchema } = require('./thesis.schema');
const {
  createThesis,
  listTheses,
  getThesis,
  submitVersion,
  startReview,
  approve,
  requestRevisions,
} = require('./thesis.controller');

const router = Router();

router.post('/', requireAuth, validate(createThesisSchema), createThesis);
router.get('/', requireAuth, listTheses);
router.get('/:id', requireAuth, getThesis);
router.post('/:id/submissions', requireAuth, submitVersion);
router.post(
  '/:id/submissions/upload',
  requireAuth,
  upload.single('file'),
  submitVersion,
);
router.post('/:id/start-review', requireAuth, startReview);
router.post('/:id/approve', requireAuth, approve);
router.post('/:id/request-revisions', requireAuth, requestRevisions);

module.exports = router;

