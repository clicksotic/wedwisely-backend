const eventRoutes = require('./routes/eventRoutes');
const eventServiceRoutes = require('./routes/eventServiceRoutes');
const EventController = require('./controllers/eventController');
const EventServiceController = require('./controllers/eventServiceController');
const EventService = require('./services/eventService');
const EventServiceService = require('./services/eventServiceService');
const Event = require('./models/Event');
const EventServiceModel = require('./models/EventService');
const { validateEvent } = require('./middleware/eventMiddleware');

module.exports = {
  routes: {
    events: eventRoutes,
    eventServices: eventServiceRoutes,
  },
  controllers: {
    event: EventController,
    eventService: EventServiceController,
  },
  services: {
    event: EventService,
    eventService: EventServiceService,
  },
  models: {
    event: Event,
    eventService: EventServiceModel,
  },
  middleware: {
    validateEvent,
  },
};
