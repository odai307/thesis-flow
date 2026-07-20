const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { listNotifications, markRead, markAllRead } = require('./notification.controller');

const router = Router();

router.get('/', requireAuth, listNotifications);
router.patch('/:id/read', requireAuth, markRead);
router.post('/read-all', requireAuth, markAllRead);

module.exports = router;
