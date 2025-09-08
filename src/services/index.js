const serviceRoutes = require('./routes/serviceRoutes');
const ServiceController = require('./controllers/serviceController');
const ServiceService = require('./services/serviceServices');
const Service = require('./models/Service');
const ServiceMedia = require('./models/ServiceMedia');
const { validateRequest } = require('./middleware/serviceMiddleware');

module.exports = {
  routes: {
    services: serviceRoutes,
  },
  controllers: {
    service: ServiceController,
  },
  services: {
    service: ServiceService,
  },
  models: {
    service: Service,
    serviceMedia: ServiceMedia,
  },
  middleware: {
    validateRequest,
  },
};
