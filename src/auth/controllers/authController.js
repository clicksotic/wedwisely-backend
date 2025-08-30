const AuthService = require('../services/authService');
const { createError } = require('../../utils/errorHandler');

class AuthController {
  // User registration
  // User registration
async register(req, res, next) {
  try {
    // Always default role to 'user' if not provided
    let role = req.body.role || 'user';

    // If someone tries to register as admin, check if requester is an admin
    if (role === 'admin') {
      if (!req.user || req.user.role !== 'admin') {
        throw createError(403, 'Only admins can create another admin user');
      }
    } else {
      role = req.body.role; // enforce normal users by default
    }

    // Pass modified body to AuthService
    const result = await AuthService.register({
      ...req.body,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
}
async createAdmin(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw createError(403, 'Only admins can create another admin user');
    }

    const result = await AuthService.register({
      ...req.body,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

  // User login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw createError(400, 'Email and password are required');
      }

      const result = await AuthService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        throw createError(400, 'Refresh token is required');
      }

      const result = await AuthService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getCurrentUser(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        throw createError(400, 'Current password and new password are required');
      }

      const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout (client-side token removal)
  async logout(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove tokens from client storage.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
