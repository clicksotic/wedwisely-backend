const Package = require("../models/Package");
const Service = require("../../services/models/Service");
const ServiceMedia = require("../../services-media/models/ServiceMedia");

class PackageService {
  async createPackage(vendorId, data) {
    // Ensure all services exist, active, and belong to this vendor
    const services = await Service.find({ _id: { $in: data.services }, isActive: true }).select("_id vendor");

    if (!services || services.length !== data.services.length) {
      throw new Error("One or more services are invalid or inactive");
    }

    const invalidOwnership = services.some(s => s.vendor.toString() !== vendorId);
    if (invalidOwnership) {
      throw new Error("All services in a package must belong to the same vendor");
    }

    const pkg = new Package({
      vendor: vendorId,
      name: data.name,
      description: data.description,
      services: data.services,
      price: data.price,
    });

    return await pkg.save();
  }

  async getPackageDetails(packageId) {
    const pkg = await Package.findOne({ _id: packageId, isActive: true })
      .populate("vendor", "firstName lastName email profilePicture phone")
      .populate({
        path: "services",
        select: "name category price location vendor",
        populate: { path: "vendor", select: "firstName lastName profilePicture" },
      })
      .select("-__v");

    if (!pkg) return null;

    return pkg;
  }

  async getAllPackages(filters = {}) {
    const query = { isActive: true };
    if (filters.vendor) query.vendor = filters.vendor;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    let pkgs = await Package.find(query)
      .populate("vendor", "firstName lastName profilePicture")
      .populate({ path: "services", select: "name category price" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Date availability filtering: include only packages whose ALL services are available on the given date
    if (filters.date) {
      const date = new Date(filters.date);
      if (!isNaN(date.getTime())) {
        // A service is considered unavailable if it is linked to any event on that date with status confirmed
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const Event = require("../../event/models/Event");
        const EventService = require("../../event/models/EventService");

        const eventsOnDate = await Event.find({ date: { $gte: start, $lte: end } }).select("_id");
        const eventIds = eventsOnDate.map(e => e._id);

        if (eventIds.length > 0) {
          const busyServiceLinks = await EventService.find({ event: { $in: eventIds }, status: "confirmed" }).select("service");
          const busyServiceIds = new Set(busyServiceLinks.map(l => String(l.service)));

          pkgs = pkgs.filter(pkg => {
            const allServices = (pkg.services || []).map(s => String(s._id || s));
            return allServices.every(sid => !busyServiceIds.has(sid));
          });
        }
        // If no events on that date, all services are available; no further filtering needed
      }
    }

    // For filtered list (post-processing by date), total should reflect the in-memory filtered count
    const total = filters.date ? pkgs.length : await Package.countDocuments(query);

    return {
      packages: pkgs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async updatePackage(packageId, data, userId, userRole) {
    const pkg = await Package.findOne({ _id: packageId, isActive: true });
    if (!pkg) throw new Error("Package not found");

    if (pkg.vendor.toString() !== userId && userRole !== "admin") {
      throw new Error("Only the package owner or admin can update this package");
    }

    if (data.services) {
      const services = await Service.find({ _id: { $in: data.services }, isActive: true }).select("_id vendor");
      if (!services || services.length !== data.services.length) {
        throw new Error("One or more services are invalid or inactive");
      }
      const invalidOwnership = services.some(s => s.vendor.toString() !== pkg.vendor.toString());
      if (invalidOwnership) {
        throw new Error("All services in a package must belong to the same vendor");
      }
    }

    const updated = await Package.findByIdAndUpdate(
      packageId,
      {
        name: data.name !== undefined ? data.name : pkg.name,
        description: data.description !== undefined ? data.description : pkg.description,
        services: data.services !== undefined ? data.services : pkg.services,
        price: data.price !== undefined ? data.price : pkg.price,
        isActive: data.isActive !== undefined ? data.isActive : pkg.isActive,
      },
      { new: true, runValidators: true }
    )
      .populate("vendor", "firstName lastName email")
      .populate({ path: "services", select: "name category price" });

    return updated;
  }

  async deletePackage(packageId, userId, userRole) {
    const pkg = await Package.findOne({ _id: packageId, isActive: true });
    if (!pkg) throw new Error("Package not found");

    if (pkg.vendor.toString() !== userId && userRole !== "admin") {
      throw new Error("Only the package owner or admin can delete this package");
    }

    await Package.findByIdAndUpdate(packageId, { isActive: false });
    return { message: "Package deleted successfully" };
  }

  // Get package card data (minimal for frontend cards)
  async getPackageCard(packageId) {
    const pkg = await Package.findOne({ _id: packageId, isActive: true })
      .populate("vendor", "firstName lastName profilePicture")
      .select("name price vendor services createdAt");

    if (!pkg) return null;

    // Take first service image as base image for the package card
    let baseImage = null;
    if (pkg.services && pkg.services.length > 0) {
      const firstServiceId = pkg.services[0];
      const firstImage = await ServiceMedia.findOne({ service: firstServiceId, isActive: true })
        .sort({ createdAt: 1 })
        .select("mediaUrl");
      baseImage = firstImage?.mediaUrl || null;
    }

    return {
      _id: pkg._id,
      name: pkg.name,
      price: pkg.price,
      baseImage,
      servicesCount: pkg.services?.length || 0,
      vendor: {
        _id: pkg.vendor._id,
        name: `${pkg.vendor.firstName} ${pkg.vendor.lastName}`,
        profilePicture: pkg.vendor.profilePicture,
      },
      createdAt: pkg.createdAt,
    };
  }

  // Get all package cards (minimal for frontend listing)
  async getAllPackageCards(filters = {}) {
    const query = { isActive: true };
    if (filters.vendor) query.vendor = filters.vendor;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    let pkgs = await Package.find(query)
      .populate("vendor", "firstName lastName profilePicture")
      .select("name price vendor services createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Date availability filtering similar to getAllPackages
    if (filters.date) {
      const date = new Date(filters.date);
      if (!isNaN(date.getTime())) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const Event = require("../../event/models/Event");
        const EventService = require("../../event/models/EventService");
        const eventsOnDate = await Event.find({ date: { $gte: start, $lte: end } }).select("_id");
        const eventIds = eventsOnDate.map(e => e._id);

        if (eventIds.length > 0) {
          const busyServiceLinks = await EventService.find({ event: { $in: eventIds }, status: "confirmed" }).select("service");
          const busyServiceIds = new Set(busyServiceLinks.map(l => String(l.service)));
          pkgs = pkgs.filter(pkg => {
            const allServices = (pkg.services || []).map(s => String(s._id || s));
            return allServices.every(sid => !busyServiceIds.has(sid));
          });
        }
      }
    }

    const packagesWithImages = await Promise.all(
      pkgs.map(async (pkg) => {
        let baseImage = null;
        if (pkg.services && pkg.services.length > 0) {
          const firstServiceId = pkg.services[0];
          const firstImage = await ServiceMedia.findOne({ service: firstServiceId, isActive: true })
            .sort({ createdAt: 1 })
            .select("mediaUrl");
          baseImage = firstImage?.mediaUrl || null;
        }
        return {
          _id: pkg._id,
          name: pkg.name,
          price: pkg.price,
          baseImage,
          servicesCount: pkg.services?.length || 0,
          vendor: {
            _id: pkg.vendor._id,
            name: `${pkg.vendor.firstName} ${pkg.vendor.lastName}`,
            profilePicture: pkg.vendor.profilePicture,
          },
          createdAt: pkg.createdAt,
        };
      })
    );

    const total = filters.date ? pkgs.length : await Package.countDocuments(query);

    return {
      packages: packagesWithImages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}

module.exports = new PackageService();


