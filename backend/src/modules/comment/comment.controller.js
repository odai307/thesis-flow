const { asyncHandler } = require('../../shared/errors');
const commentService = require('./comment.service');

const listComments = asyncHandler(async (req, res) => {
  const comments = await commentService.listComments(req.params.submissionId, req.user.id);
  res.json({ comments });
});

const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.submissionId,
    req.body.content,
    req.user.id,
  );
  res.status(201).json({ comment });
});

module.exports = { listComments, createComment };
