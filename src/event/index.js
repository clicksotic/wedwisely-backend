const eventRoutes = require('./routes/eventRoutes');
const EventController = require('./controllers/eventController');
const EventService = require('./services/eventService');
const Event = require('./models/Event');
const { validateEvent } = require('./middleware/eventMiddleware');

module.exports = {
  routes: {
    events: eventRoutes,
  },
  controllers: {
    event: EventController,
  },
  services: {
    event: EventService,
  },
  models: {
    event: Event,
  },
  middleware: {
    validateEvent,
  },
};
