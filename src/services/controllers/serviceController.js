const serviceService = require("../services/serviceServices");
const { createError } = require("../../utils/errorHandler");

// Create a new service (only for vendors)
exports.createService = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can create services"));
    }

    const vendorId = req.user.id; // from JWT
    const service = await serviceService.createService(vendorId, req.body);
    res.status(201).json(service);
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get service card data (minimal for frontend cards)
exports.getServiceCard = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceCard(req.params.id);
    if (!service) return next(createError(404, "Service not found"));
    res.json(service);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get full service details (complete data with all images)
exports.getService = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceDetails(req.params.id);
    if (!service) return next(createError(404, "Service not found"));
    res.json(service);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all services cards (minimal data for frontend listing)
exports.getAllServiceCards = async (req, res, next) => {
  try {
    const result = await serviceService.getAllServiceCards(req.query);
    res.json(result);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update a service (owner only)
exports.updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    res.json(service);
  } catch (err) {
    if (err.message === "Service not found") {
      return next(createError(404, err.message));
    }
    if (err.message.includes("Only the service owner")) {
      return next(createError(403, err.message));
    }
    next(createError(400, err.message));
  }
};

// Delete a service (owner or admin)
exports.deleteService = async (req, res, next) => {
  try {
    const result = await serviceService.deleteService(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.json(result);
  } catch (err) {
    if (err.message === "Service not found") {
      return next(createError(404, err.message));
    }
    if (err.message.includes("Only the service owner")) {
      return next(createError(403, err.message));
    }
    next(createError(400, err.message));
  }
};

// Get all services for a vendor (vendor's own services)
exports.getVendorServices = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can access their own services"));
    }

    const result = await serviceService.getVendorServices(req.user.id, req.query);
    res.json({
      message: "Vendor services retrieved successfully",
      data: result
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};