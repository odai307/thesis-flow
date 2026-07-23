const jwt = require('jsonwebtoken');
const { AppError } = require('../shared/errors');

// Verifies the Bearer token and attaches req.user. Use on protected routes.
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid Authorization header', 401));
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

// Restricts route execution to users with specific roles (e.g., 'coordinator', 'supervisor')
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AppError('Forbidden: Insufficient permissions', 403));
  }
  next();
};

module.exports = { requireAuth, requireRole };
