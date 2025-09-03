const Event = require("../models/Event");

class EventService {
  async createEvent(userId, data) {
    const event = new Event({
      user: userId,
      date: data.date,
      location: {
        city: data.location?.city,
        country: data.location?.country,
      },
    });

    return await event.save();
  }

  async getEvent(eventId, userId) {
    // Only return if this event belongs to the logged-in user
    return await Event.findOne({ _id: eventId, user: userId })
      .populate("user", "firstName lastName email");
  }

  async getEventsByUser(userId) {
    return await Event.find({ user: userId }).sort({ createdAt: -1 });
  }

  async updateEvent(eventId, updates, userId) {
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) return null;

    if (updates.date !== undefined) {
      event.date = updates.date;
    }
    if (updates.location) {
      event.location = {
        city: updates.location.city || event.location.city,
        country: updates.location.country || event.location.country,
      };
    }

    return await event.save();
  }

  async deleteEvent(eventId, userId) {
    return await Event.findOneAndDelete({ _id: eventId, user: userId });
  }

  // 🔥 Admin only: Get all events across all users
  async getAllEvents() {
    return await Event.find()
      .populate("user", "firstName lastName email role")
      .sort({ createdAt: -1 });
  }
}

module.exports = new EventService();
