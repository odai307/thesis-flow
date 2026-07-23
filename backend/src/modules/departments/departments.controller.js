const { prisma } = require('../../lib/prisma');
const { AppError, sendError } = require('../../shared/errors');

// GET /api/departments - List departments for registration dropdown & coordinator dashboard
async function listDepartments(req, res) {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        coordinatorId: true,
        coordinator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ departments });
  } catch (error) {
    sendError(res, error);
  }
}

// POST /api/departments - Coordinator: Create department
async function createDepartment(req, res) {
  try {
    const { name, coordinatorId } = req.body;

    const coordinatorUser = await prisma.user.findUnique({ where: { id: coordinatorId } });
    if (!coordinatorUser) {
      throw new AppError('Assigned coordinator user not found', 404);
    }

    const department = await prisma.department.create({
      data: { name, coordinatorId },
      include: {
        coordinator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    res.status(201).json({ department });
  } catch (error) {
    sendError(res, error);
  }
}

// PATCH /api/departments/:id - Coordinator: Update department
async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, coordinatorId } = req.body;

    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Department not found', 404);
    }

    if (coordinatorId && coordinatorId !== existing.coordinatorId) {
      const coordinatorUser = await prisma.user.findUnique({ where: { id: coordinatorId } });
      if (!coordinatorUser) {
        throw new AppError('Assigned coordinator user not found', 404);
      }
    }

    const updated = await prisma.department.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(coordinatorId ? { coordinatorId } : {}),
      },
      include: {
        coordinator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    res.json({ department: updated });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  listDepartments,
  createDepartment,
  updateDepartment,
};
