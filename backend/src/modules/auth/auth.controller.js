const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');
const { generateUniqueIndexNumber } = require('../../shared/indexGenerator');

// POST /api/auth/register - Register a new student
async function register(req, res) {
  try {
    const { firstName, lastName, email, password, departmentId } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already registered', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const indexNumber = await generateUniqueIndexNumber();

    const user = await prisma.user.create({
      data: {
        indexNumber,
        firstName,
        lastName,
        email,
        passwordHash,
        role: 'student',
        departmentId,
      },
      select: {
        id: true,
        indexNumber: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        departmentId: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/auth/login - Login and get JWT token
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt) {
      throw new AppError('Invalid credentials', 401);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        indexNumber: user.indexNumber,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    sendError(res, error);
  }
}

// GET /api/auth/me - Get current user info
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        indexNumber: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        departmentId: true,
        department: { select: { id: true, name: true } },
      },
    });

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/auth/forgot-password - Send password reset token
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt) {
      return res.json({ message: 'If that email exists, a password reset token has been generated.' });
    }

    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    console.log(`[DEV MAIL] Password reset token for ${email}: ${rawToken}`);

    res.json({ message: 'If that email exists, a password reset token has been generated.', rawToken });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/auth/reset-password - Reset password using token
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { register, login, me, forgotPassword, resetPassword };