const { z } = require('zod');

const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  coordinatorId: z.string().min(1, 'Coordinator ID is required'),
});

const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  coordinatorId: z.string().min(1).optional(),
});

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
};
