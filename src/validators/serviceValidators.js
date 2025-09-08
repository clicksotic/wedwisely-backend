// Validation functions for Service

// For creating a new Service
const createServiceSchema = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Service name is required and must be a string");
  } else if (data.name.length > 100) {
    errors.push("Service name cannot exceed 100 characters");
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push("Service description is required and must be a string");
  } else if (data.description.length > 500) {
    errors.push("Service description cannot exceed 500 characters");
  }

  if (!data.category || typeof data.category !== "string") {
    errors.push("Service category is required and must be a string");
  } else {
    const validCategories = ["Photography", "Catering", "Decoration", "Music", "Transportation", "Venue", "Others"];
    if (!validCategories.includes(data.category)) {
      errors.push(`Category must be one of: ${validCategories.join(", ")}`);
    }
  }

  // Location is now optional
  if (data.location) {
    if (data.location.city !== undefined && (typeof data.location.city !== "string" || data.location.city.trim().length === 0)) {
      errors.push("City must be a string if provided");
    }
    if (data.location.country !== undefined && (typeof data.location.country !== "string" || data.location.country.trim().length === 0)) {
      errors.push("Country must be a string if provided");
    }
  }

  if (!data.price || typeof data.price !== "number") {
    errors.push("Service price is required and must be a number");
  } else if (Number(data.price) < 0) {
    errors.push("Price cannot be negative");
  }

  return { error: errors.length > 0 ? errors : null };
};

// For updating a Service
const updateServiceSchema = (data) => {
  const errors = [];

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length === 0) {
      errors.push("Service name must be a string");
    } else if (data.name.length > 100) {
      errors.push("Service name cannot exceed 100 characters");
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string" || data.description.trim().length === 0) {
      errors.push("Service description must be a string");
    } else if (data.description.length > 500) {
      errors.push("Service description cannot exceed 500 characters");
    }
  }

  if (data.category !== undefined) {
    if (typeof data.category !== "string") {
      errors.push("Service category must be a string");
    } else {
      const validCategories = ["Photography", "Catering", "Decoration", "Music", "Transportation", "Venue", "Others"];
      if (!validCategories.includes(data.category)) {
        errors.push(`Category must be one of: ${validCategories.join(", ")}`);
      }
    }
  }

  if (data.location !== undefined) {
    if (data.location.city !== undefined && (typeof data.location.city !== "string" || data.location.city.trim().length === 0)) {
      errors.push("City must be a string if provided");
    }
    if (data.location.country !== undefined && (typeof data.location.country !== "string" || data.location.country.trim().length === 0)) {
      errors.push("Country must be a string if provided");
    }
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number") {
      errors.push("Service price must be a number");
    } else if (Number(data.price) < 0) {
      errors.push("Price cannot be negative");
    }
  }

  if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
    errors.push("isActive must be a boolean");
  }

  // Check if at least one field is provided for update
  const hasUpdates = data.name !== undefined || 
                    data.description !== undefined || 
                    data.category !== undefined || 
                    data.location !== undefined || 
                    data.price !== undefined;
  if (!hasUpdates) {
    errors.push("At least one field must be provided for update");
  }

  return { error: errors.length > 0 ? errors : null };
};

// For getting all services with optional filters/pagination
const getAllServicesSchema = (query) => {
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

  if (query.category && typeof query.category !== "string") {
    errors.push("Category must be a string");
  }

  if (query.minPrice && isNaN(Number(query.minPrice))) {
    errors.push("Min price must be a number");
  }

  if (query.maxPrice && isNaN(Number(query.maxPrice))) {
    errors.push("Max price must be a number");
  }

  return { error: errors.length > 0 ? errors : null };
};

module.exports = {
  createServiceSchema,
  updateServiceSchema,
  getAllServicesSchema,
};
