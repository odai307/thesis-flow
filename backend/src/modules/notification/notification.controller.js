const { asyncHandler } = require('../../shared/errors');
const notificationService = require('./notification.service');

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listNotifications(req.user.id);
  res.json({ notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.params.id, req.user.id);
  res.json({ notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllRead(req.user.id);
  res.json(result);
});

module.exports = { listNotifications, markRead, markAllRead };
