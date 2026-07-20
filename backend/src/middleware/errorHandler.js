const { AppError } = require('../shared/errors');

// Express 5 recognizes an error handler by its 4 arguments.
const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = { errorHandler };
