const JWTService = require('../services/jwtService');
const User = require('../models/User');
const { createError } = require('../../utils/errorHandler');

// Middleware to protect routes (require authentication)
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw createError(401, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = JWTService.verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, 'User no longer exists.');
    }

    // Check if user is still active
    if (!user.isActive) {
      throw createError(401, 'User account is deactivated.');
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      throw createError(401, 'User recently changed password. Please log in again.');
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, `Role '${req.user.role}' is not authorized to access this resource`));
    }

    next();
  };
};

// Middleware to check if user can access their own data or is admin
const canAccessUserData = (req, res, next) => {
  const requestedUserId = req.params.id || req.params.userId;
  
  if (!requestedUserId) {
    return next(createError(400, 'User ID is required'));
  }

  // Admin can access any user data
  if (req.user.role === 'admin') {
    return next();
  }

  // Users can only access their own data
  if (req.user._id.toString() === requestedUserId) {
    return next();
  }

  // Vendors can access their own data
  if (req.user.role === 'vendor' && req.user._id.toString() === requestedUserId) {
    return next();
  }

  return next(createError(403, 'Access denied. You can only access your own data.'));
};

// Middleware to check if user can modify user data
const canModifyUserData = (req, res, next) => {
  const requestedUserId = req.params.id || req.params.userId;
  
  if (!requestedUserId) {
    return next(createError(400, 'User ID is required'));
  }

  // Admin can modify any user data
  if (req.user.role === 'admin') {
    return next();
  }

  // Users can only modify their own data
  if (req.user._id.toString() === requestedUserId) {
    return next();
  }

  return next(createError(403, 'Access denied. You can only modify your own data.'));
};

module.exports = {
  authenticate,
  authorize,
  canAccessUserData,
  canModifyUserData
};
