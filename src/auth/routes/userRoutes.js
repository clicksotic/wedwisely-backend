const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize, canAccessUserData, canModifyUserData } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/all', authorize('admin'), userController.getAllUsers);
router.get('/stats', authorize('admin'), userController.getUserStats);
router.delete('/:id', authorize('admin'), userController.deleteUser);

// Routes accessible by admin or self
router.get('/:id', canAccessUserData, userController.getUserById);
router.put('/:id', canModifyUserData, userController.updateUserById);

module.exports = router;
