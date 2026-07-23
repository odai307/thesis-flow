const bcrypt = require('bcryptjs');
const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');
const { generateUniqueIndexNumber } = require('../../shared/indexGenerator');

// GET /api/users/supervisors - List supervisors in caller's department
async function listSupervisors(req, res) {
  try {
    const me = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!me || me.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const supervisors = await prisma.user.findMany({
      where: {
        role: 'supervisor',
        deletedAt: null,
        ...(me.departmentId ? { departmentId: me.departmentId } : {}),
      },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: 'asc' },
    });
    res.json({ supervisors });
  } catch (error) {
    sendError(res, error);
  }
}

// GET /api/users/my-students - Supervisor: List all students in supervisor's department/assigned
async function listMyStudents(req, res) {
  try {
    const supervisorId = req.user.id;
    const me = await prisma.user.findUnique({ where: { id: supervisorId } });
    if (!me || me.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        deletedAt: null,
        ...(me.departmentId ? { departmentId: me.departmentId } : {}),
      },
      select: {
        id: true,
        indexNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        studentTheses: {
          where: { supervisorId },
          select: {
            id: true,
            title: true,
            status: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    res.json({ students });
  } catch (error) {
    sendError(res, error);
  }
}

// GET /api/users - Coordinator: List users (supports departmentId and role filters)
async function listUsers(req, res) {
  try {
    const me = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!me || me.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const { role, departmentId } = req.query;

    const where = {
      deletedAt: null,
      ...(departmentId && departmentId !== 'all' ? { departmentId } : {}),
      ...(role && role !== 'all' ? { role } : {}),
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        indexNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true,
        department: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/users - Coordinator: Create user
async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password, role, departmentId } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const indexNumber = await generateUniqueIndexNumber();

    const newUser = await prisma.user.create({
      data: {
        indexNumber,
        firstName,
        lastName,
        email,
        passwordHash,
        role,
        departmentId,
      },
      select: {
        id: true,
        indexNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    sendError(res, error);
  }
}

// PATCH /api/users/profile - Auth user: Update profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;

    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, id: { not: userId } },
      });
      if (existing) {
        throw new AppError('Email is already taken by another account', 400);
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    res.json({ user: updated });
  } catch (error) {
    sendError(res, error);
  }
}

// PUT /api/users/change-password - Auth user: Change password
async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new AppError('Current password is incorrect', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    sendError(res, error);
  }
}

// PATCH /api/users/:id - Coordinator: Update user details
async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser || targetUser.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const { firstName, lastName, email, role, departmentId } = req.body;
    if (email && email !== targetUser.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new AppError('Email already in use', 400);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        ...(email ? { email } : {}),
        ...(role ? { role } : {}),
        ...(departmentId ? { departmentId } : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    res.json({ user: updated });
  } catch (error) {
    sendError(res, error);
  }
}

// DELETE /api/users/:id - Coordinator: Deactivate (soft delete) user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser || targetUser.deletedAt) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  listSupervisors,
  listMyStudents,
  listUsers,
  createUser,
  updateProfile,
  changePassword,
  updateUser,
  deleteUser,
};
