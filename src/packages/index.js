const packageRoutes = require('./routes/packageRoutes');
const PackageController = require('./controllers/packageController');
const PackageService = require('./services/packageService');
const Package = require('./models/Package');
const { validateRequest } = require('./middleware/packageMiddleware');

module.exports = {
  routes: {
    packages: packageRoutes,
  },
  controllers: {
    package: PackageController,
  },
  services: {
    package: PackageService,
  },
  models: {
    package: Package,
  },
  middleware: {
    validateRequest,
  },
};


