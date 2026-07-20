const { prisma } = require('../../lib/prisma');
const { AppError } = require('../../shared/errors');
const { createNotification } = require('../notification/notification.service');

// List comments for a submission, oldest first (chronological thread).
async function listComments(submissionId, userId) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { thesis: true },
  });
  if (!submission) throw new AppError('Submission not found', 404);

  // Only participants (student, supervisor, coordinator) may view.
  const t = submission.thesis;
  const allowed = t.studentId === userId || t.supervisorId === userId;
  if (!allowed) throw new AppError('Not authorized to view these comments', 403);

  return prisma.comment.findMany({
    where: { submissionId },
    orderBy: { createdAt: 'asc' },
    include: { author: { select: { id: true, firstName: true, lastName: true, role: true } } },
  });
}

// Create a comment on a submission. The author is the logged-in user.
async function createComment(submissionId, content, userId) {
  if (!content || !content.trim()) throw new AppError('Comment cannot be empty', 400);

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { thesis: true },
  });
  if (!submission) throw new AppError('Submission not found', 404);

  const t = submission.thesis;
  const allowed = t.studentId === userId || t.supervisorId === userId;
  if (!allowed) throw new AppError('Not authorized to comment', 403);

  const comment = await prisma.comment.create({
    data: { submissionId, authorId: userId, content: content.trim() },
    include: { author: { select: { id: true, firstName: true, lastName: true, role: true } } },
  });

  // Notify the *other* participant (the one who didn't comment).
  const recipientId = t.studentId === userId ? t.supervisorId : t.studentId;
  await createNotification({
    userId: recipientId,
    thesisId: t.id,
    type: 'comment',
    referenceId: comment.id,
    message: `New comment on "${t.title}"`,
  });

  return comment;
}

module.exports = { listComments, createComment };