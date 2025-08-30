const User = require('../models/User');
const { createError } = require('../../utils/errorHandler');

class UserController {
  // Get all users (admin only)
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      // Build query
      const query = { isActive: true };
      
      if (role) {
        query.role = role;
      }
      
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const users = await User.find(query)
        .select('-password')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Get total count
      const total = await User.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID (admin or self)
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('-password');
      if (!user) {
        throw createError(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user by ID (admin or self)
  async updateUserById(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated
      const { password, email, ...allowedUpdates } = updateData;

      // Only admin can change role
      if (req.user.role !== 'admin' && updateData.role) {
        delete updateData.role;
      }

      const user = await User.findByIdAndUpdate(
        id,
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw createError(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user (admin only)
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        throw createError(404, 'User not found');
      }

      // Soft delete - set isActive to false
      user.isActive = false;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user statistics (admin only)
  async getUserStats(req, res, next) {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            activeCount: {
              $sum: { $cond: ['$isActive', 1, 0] }
            }
          }
        }
      ]);

      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          roleStats: stats,
          inactiveUsers: totalUsers - activeUsers
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
