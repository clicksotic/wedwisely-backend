const eventServiceService = require("../services/eventServiceService");
const serviceApprovalService = require("../../services/services/serviceApprovalService");
const { createError } = require("../../utils/errorHandler");

// Request approval to add a service to an event (only event owner can do this)
exports.addServiceToEvent = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can request to add services to events"));
    }

    const { eventId, serviceId } = req.params;
    const approvalRequest = await serviceApprovalService.requestServiceApproval(
      eventId,
      serviceId,
      req.user.id
    );
    
    res.status(201).json({
      message: "Service approval request submitted successfully. The service owner will be notified.",
      data: approvalRequest,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get all services linked to an event
exports.getServicesByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const services = await eventServiceService.getServicesByEvent(
      eventId,
      req.user.id,
      req.user.role
    );
    
    res.json({
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Remove a service from an event
exports.removeServiceFromEvent = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can remove services from events"));
    }

    const { eventId, serviceId } = req.params;
    const eventService = await eventServiceService.removeServiceFromEvent(
      eventId,
      serviceId,
      req.user.id
    );
    
    res.json({
      message: "Service removed from event successfully",
      data: eventService,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Update service status
exports.updateServiceStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can update service status"));
    }

    const { eventId, serviceId } = req.params;
    const { status } = req.body;
    
    const eventService = await eventServiceService.updateServiceStatus(
      eventId,
      serviceId,
      status,
      req.user.id
    );
    
    res.json({
      message: "Service status updated successfully",
      data: eventService,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Add notes to a service
exports.addServiceNotes = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can add notes to services"));
    }

    const { eventId, serviceId } = req.params;
    const { notes } = req.body;
    
    const eventService = await eventServiceService.addServiceNotes(
      eventId,
      serviceId,
      notes,
      req.user.id
    );
    
    res.json({
      message: "Service notes updated successfully",
      data: eventService,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get all events that have a specific service (admin only)
exports.getEventsByService = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Only admins can view events by service"));
    }

    const { serviceId } = req.params;
    const events = await eventServiceService.getEventsByService(serviceId);
    
    res.json({
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get statistics for an event
exports.getEventServiceStats = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const stats = await eventServiceService.getEventServiceStats(
      eventId,
      req.user.id,
      req.user.role
    );
    
    res.json({
      message: "Event service statistics retrieved successfully",
      data: stats,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};
