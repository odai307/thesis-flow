const { prisma } = require('../../lib/prisma');
const { AppError } = require('../../shared/errors');

// Internal helper used by other modules (comments, thesis reviews) to emit a
// notification. Not exposed as its own POST route — notifications are created
// as a side effect of domain events.
async function createNotification({ userId, thesisId, type, referenceId, message }) {
  return prisma.notification.create({
    data: { userId, thesisId, type, referenceId, message },
  });
}

// List the caller's notifications, newest first.
async function listNotifications(userId) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// Mark a single notification read (must belong to the caller).
async function markRead(id, userId) {
  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== userId) {
    throw new AppError('Notification not found', 404);
  }
  return prisma.notification.update({ where: { id }, data: { read: true } });
}

// Mark all the caller's notifications read.
async function markAllRead(userId) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return { success: true };
}

module.exports = {
  createNotification,
  listNotifications,
  markRead,
  markAllRead,
};
