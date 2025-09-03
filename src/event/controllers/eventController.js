const eventService = require("../services/eventServices");
const { createError } = require("../../utils/errorHandler");

// Create a new event (only for role = "user")
exports.createEvent = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can create events"));
    }

    const userId = req.user.id; // from JWT
    const event = await eventService.createEvent(userId, req.body);
    res.status(201).json(event);
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get a single event by ID
exports.getEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEvent(req.params.id, req.user.id);
    if (!event) return next(createError(404, "Event not found"));
    res.json(event);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all events for logged-in user
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await eventService.getEventsByUser(req.user.id);
    res.json(events);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update event (date, location, etc.)
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.user.id
    );
    if (!event)
      return next(createError(404, "Event not found or not authorized"));
    res.json(event);
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Delete an event
exports.deleteEvent = async (req, res, next) => {
  try {
    const deleted = await eventService.deleteEvent(req.params.id, req.user.id);
    if (!deleted)
      return next(createError(404, "Event not found or not authorized"));
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Admin: Get all events in the system
exports.getAllEvents = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Only admins can view all events"));
    }

    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (err) {
    next(createError(500, err.message));
  }
};
