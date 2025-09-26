// Validation functions for Event-Service linking

// For updating service status
const updateServiceStatusSchema = (data) => {
  const errors = [];

  if (!data.status) {
    errors.push("Status is required");
  } else if (!["pending", "confirmed", "cancelled"].includes(data.status)) {
    errors.push("Status must be one of: pending, confirmed, cancelled");
  }

  return { error: errors.length > 0 ? errors : null };
};

// For adding service notes
const addServiceNotesSchema = (data) => {
  const errors = [];

  if (data.notes && typeof data.notes !== "string") {
    errors.push("Notes must be a string");
  }

  if (data.notes && data.notes.length > 500) {
    errors.push("Notes cannot exceed 500 characters");
  }

  return { error: errors.length > 0 ? errors : null };
};

module.exports = {
  updateServiceStatusSchema,
  addServiceNotesSchema,
};
