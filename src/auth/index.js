const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticate, authorize, canAccessUserData, canModifyUserData } = require('./middleware/authMiddleware');
const AuthService = require('./services/authService');
const JWTService = require('./services/jwtService');

module.exports = {
  routes: {
    auth: authRoutes,
    users: userRoutes
  },
  middleware: {
    authenticate,
    authorize,
    canAccessUserData,
    canModifyUserData
  },
  services: {
    auth: AuthService,
    jwt: JWTService
  }
};
