const profileRoutes = require('./routes/profileRoutes');
const ProfileController = require('./controllers/profileController');
const ProfileService = require('./services/profileService');
const profile = require('./models/profile');
const { validateProfile } = require('./middleware/profileMiddleware');

module.exports = {
  routes: {
    profiles: profileRoutes,
  },
  controllers: {
    profile: ProfileController,
  },
  services: {
    profile: ProfileService,
  },
  models: {
    profile: Profile,
  },
  middleware: {
    validateProfile,
  },
};
