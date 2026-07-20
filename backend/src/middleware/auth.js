const jwt = require('jsonwebtoken');
const { AppError } = require('../shared/errors');

// Verifies the Bearer token and attaches req.user. Use on protected routes.
const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid Authorization header', 401));
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) ;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = { requireAuth };
