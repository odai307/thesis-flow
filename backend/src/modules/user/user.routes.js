const { Router } = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('./user.schema');
const {
  listSupervisors,
  listMyStudents,
  listUsers,
  createUser,
  updateProfile,
  changePassword,
  updateUser,
  deleteUser,
} = require('./user.controller');

const router = Router();

router.get('/supervisors', requireAuth, listSupervisors);
router.get('/my-students', requireAuth, requireRole('supervisor'), listMyStudents);
router.patch('/profile', requireAuth, validate(updateProfileSchema), updateProfile);
router.put('/change-password', requireAuth, validate(changePasswordSchema), changePassword);

// Coordinator-only endpoints
router.get('/', requireAuth, requireRole('coordinator'), listUsers);
router.post('/', requireAuth, requireRole('coordinator'), validate(createUserSchema), createUser);
router.patch('/:id', requireAuth, requireRole('coordinator'), validate(updateUserSchema), updateUser);
router.delete('/:id', requireAuth, requireRole('coordinator'), deleteUser);

module.exports = router;
