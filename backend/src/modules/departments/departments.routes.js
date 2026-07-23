const { Router } = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createDepartmentSchema, updateDepartmentSchema } = require('./departments.schema');
const {
  listDepartments,
  createDepartment,
  updateDepartment,
} = require('./departments.controller');

const router = Router();

router.get('/', listDepartments);
router.post('/', requireAuth, requireRole('coordinator'), validate(createDepartmentSchema), createDepartment);
router.patch('/:id', requireAuth, requireRole('coordinator'), validate(updateDepartmentSchema), updateDepartment);

module.exports = router;
