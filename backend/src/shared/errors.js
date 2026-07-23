// Application error class - thrown anywhere in the app for known error cases
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

// Centralized response helper to send error responses directly from controllers
function sendError(res, error) {
  const status = error.statusCode || 500;
  if (status === 500) console.error(error);
  return res.status(status).json({ error: error.message || 'Internal server error' });
}

module.exports = { AppError, sendError };