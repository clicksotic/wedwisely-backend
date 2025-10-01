const packageService = require("../services/packageService");
const { createError } = require("../../utils/errorHandler");

// Create a new package (only for vendors)
exports.createPackage = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can create packages"));
    }

    const vendorId = req.user.id;
    const pkg = await packageService.createPackage(vendorId, req.body);
    res.status(201).json(pkg);
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get full package details
exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await packageService.getPackageDetails(req.params.id);
    if (!pkg) return next(createError(404, "Package not found"));
    res.json(pkg);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all packages (with pagination and filters)
exports.getAllPackages = async (req, res, next) => {
  try {
    const result = await packageService.getAllPackages(req.query);
    res.json(result);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all packages cards (minimal for frontend listing)
exports.getAllPackageCards = async (req, res, next) => {
  try {
    const result = await packageService.getAllPackageCards(req.query);
    res.json(result);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get package card data (minimal for frontend cards)
exports.getPackageCard = async (req, res, next) => {
  try {
    const pkg = await packageService.getPackageCard(req.params.id);
    if (!pkg) return next(createError(404, "Package not found"));
    res.json(pkg);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update a package (owner only)
exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await packageService.updatePackage(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    res.json(pkg);
  } catch (err) {
    if (err.message === "Package not found") {
      return next(createError(404, err.message));
    }
    if (err.message.includes("Only the package owner")) {
      return next(createError(403, err.message));
    }
    next(createError(400, err.message));
  }
};

// Delete a package (owner or admin)
exports.deletePackage = async (req, res, next) => {
  try {
    const result = await packageService.deletePackage(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.json(result);
  } catch (err) {
    if (err.message === "Package not found") {
      return next(createError(404, err.message));
    }
    if (err.message.includes("Only the package owner")) {
      return next(createError(403, err.message));
    }
    next(createError(400, err.message));
  }
};


