const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../lib/prisma');
const { AppError } = require('../../shared/errors');
const { registerSchema, loginSchema } = require('./auth.schema');

async function register(input) {
  const data = registerSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      role: 'student',
      departmentId: data.departmentId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
    },
  });

  return user;
}

async function login(input) {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
  );

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      departmentId: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

module.exports = { register, login, getMe };
