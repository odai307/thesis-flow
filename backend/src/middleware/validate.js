const { AppError } = require('../shared/errors');

// Validates req.body against a zod schema; on failure forwards a 400.
// On success, replaces req.body with the parsed (typed) data.
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(
      new AppError(
        result.error.issues.map((i) => i.message).join(', '),
        400,
      ),
    );
  }
  req.body = result.data;
  next();
};

module.exports = { validate };
