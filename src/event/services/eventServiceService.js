const EventService = require("../models/EventService");
const Event = require("../models/Event");
const Service = require("../../services/models/Service");

class EventServiceService {
  // Add a service to an event (only event owner can do this)
  async addServiceToEvent(eventId, serviceId, userId) {
    // First verify the event exists and belongs to the user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to modify it");
    }

    // Verify the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error("Service not found");
    }

    // Check if this service is already linked to the event
    const existingLink = await EventService.findOne({ event: eventId, service: serviceId });
    if (existingLink) {
      throw new Error("This service is already linked to the event");
    }

    // Create the link
    const eventService = new EventService({
      event: eventId,
      service: serviceId,
      addedBy: userId,
    });

    return await eventService.save();
  }

  // Get all services linked to an event (only event owner or admin can access)
  async getServicesByEvent(eventId, userId, userRole) {
    // If user is admin, they can access any event's services
    if (userRole === "admin") {
      return await EventService.find({ event: eventId })
        .populate("service", "name description category price location vendor")
        .populate("addedBy", "firstName lastName email")
        .populate("event", "date location")
        .sort({ createdAt: -1 });
    }

    // For regular users, verify they own the event
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to view its services");
    }

    return await EventService.find({ event: eventId })
      .populate("service", "name description category price location vendor")
      .populate("addedBy", "firstName lastName email")
      .populate("event", "date location")
      .sort({ createdAt: -1 });
  }

  // Remove a service from an event (only event owner can do this)
  async removeServiceFromEvent(eventId, serviceId, userId) {
    // First verify the event exists and belongs to the user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to modify it");
    }

    // Find and delete the link
    const eventService = await EventService.findOneAndDelete({
      event: eventId,
      service: serviceId,
    });

    if (!eventService) {
      throw new Error("Service is not linked to this event");
    }

    return eventService;
  }

  // Update service status (only event owner can do this)
  async updateServiceStatus(eventId, serviceId, status, userId) {
    // First verify the event exists and belongs to the user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to modify it");
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status. Must be one of: pending, confirmed, cancelled");
    }

    // Update the status
    const eventService = await EventService.findOneAndUpdate(
      { event: eventId, service: serviceId },
      { status: status },
      { new: true }
    );

    if (!eventService) {
      throw new Error("Service is not linked to this event");
    }

    return eventService;
  }

  // Add notes to a service (only event owner can do this)
  async addServiceNotes(eventId, serviceId, notes, userId) {
    // First verify the event exists and belongs to the user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to modify it");
    }

    // Update the notes
    const eventService = await EventService.findOneAndUpdate(
      { event: eventId, service: serviceId },
      { notes: notes },
      { new: true }
    );

    if (!eventService) {
      throw new Error("Service is not linked to this event");
    }

    return eventService;
  }

  // Get all events that have a specific service (admin only)
  async getEventsByService(serviceId) {
    return await EventService.find({ service: serviceId })
      .populate("event", "date location user")
      .populate("service", "name description category")
      .populate("addedBy", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  // Get statistics for an event (only event owner or admin can access)
  async getEventServiceStats(eventId, userId, userRole) {
    // If user is admin, they can access any event's stats
    if (userRole === "admin") {
      const stats = await EventService.aggregate([
        { $match: { event: eventId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const totalServices = await EventService.countDocuments({ event: eventId });
      
      return {
        totalServices,
        statusBreakdown: stats,
      };
    }

    // For regular users, verify they own the event
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to view its statistics");
    }

    const stats = await EventService.aggregate([
      { $match: { event: eventId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalServices = await EventService.countDocuments({ event: eventId });
    
    return {
      totalServices,
      statusBreakdown: stats,
    };
  }
}

module.exports = new EventServiceService();
