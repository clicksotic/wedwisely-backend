const Service = require("../models/Service");
const ServiceMedia = require("../../services-media/models/ServiceMedia");
const Event = require("../../event/models/Event");
const EventService = require("../../event/models/EventService");

class ServiceService {
  async createService(vendorId, data) {
    const service = new Service({
      vendor: vendorId,
      name: data.name,
      description: data.description,
      category: data.category,
      location: {
        city: data.location?.city,
        country: data.location?.country,
      },
      price: data.price,
    });

    return await service.save();
  }

  async getServiceDetails(serviceId) {
    const service = await Service.findOne({ _id: serviceId, isActive: true })
      .populate("vendor", "firstName lastName email profilePicture phone")
      .select("-__v");

    if (!service) return null;

    // Get all images for this service
    const images = await ServiceMedia.find({ 
      service: serviceId, 
      isActive: true 
    }).sort({ createdAt: 1 }).select("mediaUrl mediaType createdAt");

    // Get first image as baseImage
    const baseImage = images.length > 0 ? images[0].mediaUrl : null;

    return {
      ...service.toObject(),
      baseImage: baseImage,
      images: images,
      vendor: {
        _id: service.vendor._id,
        name: `${service.vendor.firstName} ${service.vendor.lastName}`,
        email: service.vendor.email,
        profilePicture: service.vendor.profilePicture,
        phone: service.vendor.phone
      }
    };
  }

  // Get service card data (minimal for frontend cards)
  async getServiceCard(serviceId) {
    const service = await Service.findOne({ _id: serviceId, isActive: true })
      .populate("vendor", "firstName lastName profilePicture")
      .select("name category price location vendor createdAt");
    
    if (!service) return null;

    // Get first image from service media as baseImage
    const firstImage = await ServiceMedia.findOne({ 
      service: serviceId, 
      isActive: true 
    }).sort({ createdAt: 1 }).select("mediaUrl");

    return {
      _id: service._id,
      name: service.name,
      category: service.category,
      price: service.price,
      location: service.location,
      baseImage: firstImage?.mediaUrl || null, // First uploaded image
      vendor: {
        _id: service.vendor._id,
        name: `${service.vendor.firstName} ${service.vendor.lastName}`,
        profilePicture: service.vendor.profilePicture
      },
      createdAt: service.createdAt
    };
  }

  // Get all service cards (minimal data for frontend listing)
  async getAllServiceCards(filters = {}) {
    const query = { isActive: true };
    
    // Apply date availability filter (exclude services already booked on the specified date)
    if (filters.availableDate) {
      try {
        // Parse the date and create date range for the entire day
        const targetDate = new Date(filters.availableDate);
        const startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Find events happening on the specified date
        const eventsOnDate = await Event.find({
          date: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        }).select('_id');

        // Find services already booked for those events
        if (eventsOnDate.length > 0) {
          const bookedServices = await EventService.find({
            event: { $in: eventsOnDate.map(e => e._id) }
          }).distinct('service');

          // Exclude booked services from the main query
          if (bookedServices.length > 0) {
            query._id = { $nin: bookedServices };
          }
        }
      } catch (error) {
        // If date parsing fails, ignore the date filter
        console.warn('Invalid date format for availableDate filter:', filters.availableDate);
      }
    }
    
    // Apply location filters
    if (filters.city) {
      query["location.city"] = new RegExp(filters.city, "i");
    }
    if (filters.country) {
      query["location.country"] = new RegExp(filters.country, "i");
    }
    
    // Apply category filter
    if (filters.category) {
      query.category = filters.category;
    }
    
    // Apply price filters
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await Service.find(query)
      .populate("vendor", "firstName lastName profilePicture")
      .select("name category price location vendor createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get first image for each service as baseImage
    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const firstImage = await ServiceMedia.findOne({ 
          service: service._id, 
          isActive: true 
        }).sort({ createdAt: 1 }).select("mediaUrl");

        return {
          _id: service._id,
          name: service.name,
          category: service.category,
          price: service.price,
          location: service.location,
          baseImage: firstImage?.mediaUrl || null, // First uploaded image
          vendor: {
            _id: service.vendor._id,
            name: `${service.vendor.firstName} ${service.vendor.lastName}`,
            profilePicture: service.vendor.profilePicture
          },
          createdAt: service.createdAt
        };
      })
    );

    const total = await Service.countDocuments(query);

    return {
      services: servicesWithImages,
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

  async updateService(serviceId, data, userId, userRole) {
    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) throw new Error("Service not found");

    // Check if user is owner or admin
    if (service.vendor.toString() !== userId && userRole !== "admin") {
      throw new Error("Only the service owner or admin can update this service");
    }

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        name: data.name || service.name,
        description: data.description || service.description,
        category: data.category || service.category,
        location: {
          city: data.location?.city || service.location?.city,
          country: data.location?.country || service.location?.country,
        },
        price: data.price !== undefined ? data.price : service.price,
      },
      { new: true, runValidators: true }
    ).populate("vendor", "firstName lastName email");

    return updatedService;
  }

  async deleteService(serviceId, userId, userRole) {
    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) throw new Error("Service not found");

    // Check if user is owner or admin
    if (service.vendor.toString() !== userId && userRole !== "admin") {
      throw new Error("Only the service owner or admin can delete this service");
    }

    // Soft delete
    await Service.findByIdAndUpdate(serviceId, { isActive: false });
    return { message: "Service deleted successfully" };
  }

  // Get all services for a specific vendor (vendor's own services)
  async getVendorServices(vendorId, filters = {}) {
    const query = { 
      vendor: vendorId,
      isActive: true 
    };
    
    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.city) {
      query["location.city"] = new RegExp(filters.city, "i");
    }
    if (filters.country) {
      query["location.country"] = new RegExp(filters.country, "i");
    }
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await Service.find(query)
      .populate("vendor", "firstName lastName email profilePicture")
      .select("name description category price location isActive createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get first image for each service as baseImage
    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const firstImage = await ServiceMedia.findOne({ 
          service: service._id, 
          isActive: true 
        }).sort({ createdAt: 1 }).select("mediaUrl");

        return {
          _id: service._id,
          name: service.name,
          description: service.description,
          category: service.category,
          price: service.price,
          location: service.location,
          isActive: service.isActive,
          baseImage: firstImage?.mediaUrl || null,
          vendor: {
            _id: service.vendor._id,
            name: `${service.vendor.firstName} ${service.vendor.lastName}`,
            email: service.vendor.email,
            profilePicture: service.vendor.profilePicture
          },
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        };
      })
    );

    const total = await Service.countDocuments(query);

    return {
      services: servicesWithImages,
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

module.exports = new ServiceService();
