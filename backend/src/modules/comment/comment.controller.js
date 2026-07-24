const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');
const { notifySubmission, notifyUser } = require('../../lib/socket');

// Helper to check if user is a participant (student, supervisor, or coordinator)
async function isParticipant(thesisId, userId) {
  const thesis = await prisma.thesis.findUnique({
    where: { id: thesisId },
    include: { department: { select: { coordinatorId: true } } },
  });
  if (!thesis) return false;
  return (
    thesis.studentId === userId ||
    thesis.supervisorId === userId ||
    thesis.department.coordinatorId === userId
  );
}

// Helper to check if user is a comment author (student or supervisor only)
async function isCommentAuthor(thesisId, userId) {
  const thesis = await prisma.thesis.findUnique({
    where: { id: thesisId },
    include: { department: { select: { coordinatorId: true } } },
  });
  if (!thesis) return false;
  return thesis.studentId === userId || thesis.supervisorId === userId;
}

// GET /api/submissions/:submissionId/comments - List comments for a submission
async function listComments(req, res) {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { thesis: true },
    });
    if (!submission) throw new AppError('Submission not found', 404);

    const permitted = await isParticipant(submission.thesis.id, userId);
    if (!permitted) throw new AppError('Not authorized to view these comments', 403);

    const comments = await prisma.comment.findMany({
      where: { submissionId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, firstName: true, lastName: true, role: true } } },
    });

    res.json({ comments });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/submissions/:submissionId/comments - Create a comment
async function createComment(req, res) {
  try {
    const { submissionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      throw new AppError('Comment cannot be empty', 400);
    }

    const { newComment, recipientId, notification } = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.findUnique({
        where: { id: submissionId },
        include: { thesis: true },
      });
      if (!submission) throw new AppError('Submission not found', 404);

      const permitted = await isParticipant(submission.thesis.id, userId);
      if (!permitted) throw new AppError('Not authorized to comment', 403);

      const canComment = await isCommentAuthor(submission.thesis.id, userId);
      if (!canComment) throw new AppError('Only student and supervisor can comment', 403);

      const created = await tx.comment.create({
        data: {
          submissionId,
          authorId: userId,
          content: content.trim(),
        },
        include: { author: { select: { id: true, firstName: true, lastName: true, role: true } } },
      });

      const thesis = submission.thesis;
      const rId = thesis.studentId === userId ? thesis.supervisorId : thesis.studentId;
      const notif = await tx.notification.create({
        data: {
          userId: rId,
          thesisId: thesis.id,
          type: 'comment',
          referenceId: created.id,
          message: `New comment on "${thesis.title}"`,
        },
      });

      return { newComment: created, recipientId: rId, notification: notif };
    });

    // Real-time broadcasts
    notifySubmission(submissionId, 'comment:created', newComment);
    notifyUser(recipientId, 'notification:new', notification);

    res.status(201).json({ comment: newComment });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { listComments, createComment };