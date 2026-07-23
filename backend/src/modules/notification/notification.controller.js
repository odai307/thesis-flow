const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');

// GET /api/notifications - List user's notifications
async function listNotifications(req, res) {
  try {
    const { id: userId } = req.user;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ notifications });
  } catch (error) {
    sendError(res, error);
  }
}

// PATCH /api/notifications/:id/read - Mark a single notification read
async function markRead(req, res) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== userId) {
      throw new AppError('Notification not found', 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ notification: updated });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/notifications/read-all - Mark all notifications read
async function markAllRead(req, res) {
  try {
    const { id: userId } = req.user;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
}

// Reusable helper for other controllers to create notifications
async function createNotification({ userId, thesisId, type, referenceId, message }) {
  return prisma.notification.create({
    data: { userId, thesisId, type, referenceId, message },
  });
}

module.exports = { listNotifications, markRead, markAllRead, createNotification };