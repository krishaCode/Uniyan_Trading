const express = require('express');
const router = express.Router();
const {
  getUsers, getUserById, updateUser, deleteUser,
  approveUser, rejectUser, suspendUser, getDashboardStats, updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect);

router.get('/stats', adminOnly, getDashboardStats);
router.put('/profile', updateProfile);
router.get('/', adminOnly, getUsers);
router.get('/:id', adminOnly, getUserById);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);
router.put('/:id/approve', adminOnly, approveUser);
router.put('/:id/reject', adminOnly, rejectUser);
router.put('/:id/suspend', adminOnly, suspendUser);

module.exports = router;
