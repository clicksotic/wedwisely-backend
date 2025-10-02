// Validation functions for Package

// For creating a new Package
const createPackageSchema = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Package name is required and must be a string");
  } else if (data.name.length > 100) {
    errors.push("Package name cannot exceed 100 characters");
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      errors.push("Package description must be a string");
    } else if (data.description.length > 500) {
      errors.push("Package description cannot exceed 500 characters");
    }
  }

  if (!Array.isArray(data.services) || data.services.length === 0) {
    errors.push("At least one service id is required");
  }

  if (data.services && !Array.isArray(data.services)) {
    errors.push("Services must be an array of service ids");
  }

  if (data.price === undefined || typeof data.price !== "number") {
    errors.push("Package price is required and must be a number");
  } else if (Number(data.price) < 0) {
    errors.push("Price cannot be negative");
  }

  return { error: errors.length > 0 ? errors : null };
};

// For updating a Package
const updatePackageSchema = (data) => {
  const errors = [];

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length === 0) {
      errors.push("Package name must be a string");
    } else if (data.name.length > 100) {
      errors.push("Package name cannot exceed 100 characters");
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      errors.push("Package description must be a string");
    } else if (data.description.length > 500) {
      errors.push("Package description cannot exceed 500 characters");
    }
  }

  if (data.services !== undefined) {
    if (!Array.isArray(data.services)) {
      errors.push("Services must be an array of service ids");
    }
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number") {
      errors.push("Package price must be a number");
    } else if (Number(data.price) < 0) {
      errors.push("Price cannot be negative");
    }
  }

  if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
    errors.push("isActive must be a boolean");
  }

  const hasUpdates = data.name !== undefined ||
                     data.description !== undefined ||
                     data.services !== undefined ||
                     data.price !== undefined ||
                     data.isActive !== undefined;
  if (!hasUpdates) {
    errors.push("At least one field must be provided for update");
  }

  return { error: errors.length > 0 ? errors : null };
};

// For getting all packages with optional filters/pagination
const getAllPackagesSchema = (query) => {
  const errors = [];

  if (query.page && isNaN(Number(query.page))) {
    errors.push("Page must be a number");
  }

  if (query.limit && isNaN(Number(query.limit))) {
    errors.push("Limit must be a number");
  }

  if (query.vendor && typeof query.vendor !== "string") {
    errors.push("Vendor must be a string");
  }

  if (query.minPrice && isNaN(Number(query.minPrice))) {
    errors.push("Min price must be a number");
  }

  if (query.maxPrice && isNaN(Number(query.maxPrice))) {
    errors.push("Max price must be a number");
  }

  if (query.date !== undefined) {
    if (typeof query.date !== "string") {
      errors.push("Date must be a string in ISO format (YYYY-MM-DD or ISO datetime)");
    } else {
      const d = new Date(query.date);
      if (isNaN(d.getTime())) {
        errors.push("Invalid date format");
      }
    }
  }

  return { error: errors.length > 0 ? errors : null };
};

module.exports = {
  createPackageSchema,
  updatePackageSchema,
  getAllPackagesSchema,
};


