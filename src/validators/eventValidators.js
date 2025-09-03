// Validation functions for Event

// For creating a new Event
const createEventSchema = (data) => {
    const errors = [];
  
    if (data.date && isNaN(Date.parse(data.date))) {
      errors.push("Date must be a valid date");
    }
  
    if (data.location) {
      if (data.location.city && typeof data.location.city !== "string") {
        errors.push("City must be a string");
      }
      if (data.location.country && typeof data.location.country !== "string") {
        errors.push("Country must be a string");
      }
    }
  
    return { error: errors.length > 0 ? errors : null };
  };
  
  // For updating an Event
  const updateEventSchema = (data) => {
    const errors = [];
  
    if (data.date && isNaN(Date.parse(data.date))) {
      errors.push("Date must be a valid date");
    }
  
    if (data.location) {
      if (data.location.city && typeof data.location.city !== "string") {
        errors.push("City must be a string");
      }
      if (data.location.country && typeof data.location.country !== "string") {
        errors.push("Country must be a string");
      }
    }
  
    if (!data.date && !data.location) {
      errors.push("At least one field (date or location) must be provided");
    }
  
    return { error: errors.length > 0 ? errors : null };
  };
  
  // For getting all events (admin) with optional filters/pagination
  const getAllEventsSchema = (query) => {
    const errors = [];
  
    if (query.page && isNaN(Number(query.page))) {
      errors.push("Page must be a number");
    }
  
    if (query.limit && isNaN(Number(query.limit))) {
      errors.push("Limit must be a number");
    }
  
    if (query.city && typeof query.city !== "string") {
      errors.push("City must be a string");
    }
  
    if (query.country && typeof query.country !== "string") {
      errors.push("Country must be a string");
    }
  
    if (query.date && isNaN(Date.parse(query.date))) {
      errors.push("Date must be a valid date");
    }
  
    return { error: errors.length > 0 ? errors : null };
  };
  
  module.exports = {
    createEventSchema,
    updateEventSchema,
    getAllEventsSchema,
  };
  