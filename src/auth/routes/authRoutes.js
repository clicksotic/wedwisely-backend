const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, validateProfileUpdate, validatePasswordChange } = require('../../validators/authValidators');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/create-admin',validateRegistration, authenticate, authController.createAdmin);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, validateProfileUpdate, authController.updateProfile);
router.put('/change-password', authenticate, validatePasswordChange, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
