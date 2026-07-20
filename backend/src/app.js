const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./modules/auth/auth.routes');
const thesisRoutes = require('./modules/thesis/thesis.routes');
const departmentRoutes = require('./modules/departments/departments.routes');
const commentRoutes = require('./modules/comment/comment.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const { errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Serve uploaded thesis files (local dev storage; swap for cloud at deploy).
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/theses', thesisRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/submissions/:submissionId/comments', commentRoutes);
  app.use('/api/notifications', notificationRoutes);

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
