const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('./auth.schema');
const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
} = require('./auth.controller');

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;