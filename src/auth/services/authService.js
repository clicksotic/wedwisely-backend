const User = require('../models/User');
const JWTService = require('./jwtService');
const { createError } = require('../../utils/errorHandler');

class AuthService {
  // User registration
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw createError(409, 'User with this email already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate tokens
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role
      };

      const tokens = JWTService.generateTokenPair(payload);

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        tokens
      };
    } catch (error) {
      throw error;
    }
  }

  // User login
  async login(email, password) {
    try {
      // Find user and include password for comparison
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        throw createError(401, 'Invalid email or password');
      }

      if (!user.isActive) {
        throw createError(401, 'Account is deactivated. Please contact support.');
      }

      // Check password
      const isPasswordCorrect = await user.correctPassword(password, user.password);
      if (!isPasswordCorrect) {
        throw createError(401, 'Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role
      };

      const tokens = JWTService.generateTokenPair(payload);

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        tokens
      };
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = JWTService.verifyToken(refreshToken);
      
      // Find user
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw createError(401, 'User not found or inactive');
      }

      // Generate new tokens
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role
      };

      const tokens = JWTService.generateTokenPair(payload);

      return {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        tokens
      };
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw createError(404, 'User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      // Remove fields that shouldn't be updated
      const { password, role, email, ...allowedUpdates } = updateData;
      
      const user = await User.findByIdAndUpdate(
        userId,
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw createError(404, 'User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw createError(404, 'User not found');
      }

      // Verify current password
      const isCurrentPasswordCorrect = await user.correctPassword(currentPassword, user.password);
      if (!isCurrentPasswordCorrect) {
        throw createError(401, 'Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
