const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');
const { notifyUser } = require('../../lib/socket');

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

    notifyUser(userId, 'notification:read', updated);

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

    notifyUser(userId, 'notification:readAll', { userId });

    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
}

// Reusable helper for other controllers to create notifications and emit socket event
async function createNotification({ userId, thesisId, type, referenceId, message }) {
  const notif = await prisma.notification.create({
    data: { userId, thesisId, type, referenceId, message },
  });

  notifyUser(userId, 'notification:new', notif);

  return notif;
}

module.exports = { listNotifications, markRead, markAllRead, createNotification };