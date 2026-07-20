const { asyncHandler } = require('../../shared/errors');
const { requireAuth } = require('../../middleware/auth');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ user });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

// Exported as an array so it can be spread into the route as [middleware, handler].
const me = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.json({ user });
  }),
];

module.exports = { register, login, me };
