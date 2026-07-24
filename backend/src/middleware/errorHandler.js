const { AppError } = require('../shared/errors');

// Express 5 recognizes an error handler by its 4 arguments.
const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error('Unhandled server error:', err);
  const status = err.statusCode || err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal server error' });
};

module.exports = { errorHandler };
