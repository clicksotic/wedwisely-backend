const serviceRoutes = require('./routes/serviceRoutes');
const serviceApprovalRoutes = require('./routes/serviceApprovalRoutes');
const ServiceController = require('./controllers/serviceController');
const ServiceApprovalController = require('./controllers/serviceApprovalController');
const ServiceService = require('./services/serviceServices');
const ServiceApprovalService = require('./services/serviceApprovalService');
const Service = require('./models/Service');
const ServiceMedia = require('./models/ServiceMedia');
const ServiceApproval = require('./models/ServiceApproval');
const { validateRequest } = require('./middleware/serviceMiddleware');

module.exports = {
  routes: {
    services: serviceRoutes,
    serviceApprovals: serviceApprovalRoutes,
  },
  controllers: {
    service: ServiceController,
    serviceApproval: ServiceApprovalController,
  },
  services: {
    service: ServiceService,
    serviceApproval: ServiceApprovalService,
  },
  models: {
    service: Service,
    serviceMedia: ServiceMedia,
    serviceApproval: ServiceApproval,
  },
  middleware: {
    validateRequest,
  },
};
