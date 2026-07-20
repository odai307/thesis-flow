const { Router } = require('express');
const { asyncHandler } = require('../../shared/errors');
const { prisma } = require('../../lib/prisma');

const router = Router();

// GET /api/departments -> list of { id, name } for dropdowns (e.g. registration).
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const departments = await prisma.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    res.json({ departments });
  }),
);

module.exports = router;
