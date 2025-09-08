const serviceMediaRoutes = require('./routes/serviceMediaRoutes');
const ServiceMediaController = require('./controllers/serviceMediaController');
const ServiceMediaService = require('./services/serviceMediaServices');
const { validateRequest } = require('./middleware/serviceMediaMiddleware');

module.exports = {
  routes: {
    serviceMedia: serviceMediaRoutes,
  },
  controllers: {
    serviceMedia: ServiceMediaController,
  },
  services: {
    serviceMedia: ServiceMediaService,
  },
  middleware: {
    validateRequest,
  },
};
