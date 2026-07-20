const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createCommentSchema } = require('./comment.schema');
const { listComments, createComment } = require('./comment.controller');

// mergeParams so :submissionId from the mount path is available here.
const router = Router({ mergeParams: true });

router.get('/', requireAuth, listComments);
router.post('/', requireAuth, validate(createCommentSchema), createComment);

module.exports = router;
