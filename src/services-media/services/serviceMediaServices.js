const ServiceMedia = require("../models/ServiceMedia");
const Service = require("../../services/models/Service");

class ServiceMediaService {
  // Get all images for a service
  async getServiceImages(serviceId) {
    return await ServiceMedia.find({ service: serviceId, isActive: true })
      .sort({ createdAt: -1 });
  }

  // Add image to service
  async addImage(serviceId, imageUrl, uploadedBy) {
    // Verify service exists
    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) {
      throw new Error("Service not found");
    }

    const image = new ServiceMedia({
      service: serviceId,
      mediaUrl: imageUrl,
      mediaType: "image", // Always image
      uploadedBy: uploadedBy,
    });

    return await image.save();
  }

  // Delete image
  async deleteImage(imageId, userId, userRole) {
    const image = await ServiceMedia.findById(imageId);
    if (!image) return null;

    // Check if user is the service owner or admin
    const service = await Service.findById(image.service);
    const isOwner = service.vendor.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("Not authorized to delete this image");
    }

    // Soft delete
    return await ServiceMedia.findByIdAndUpdate(imageId, { isActive: false }, { new: true });
  }

  // Get image by ID
  async getImage(imageId) {
    return await ServiceMedia.findOne({ _id: imageId, isActive: true });
  }
}

module.exports = new ServiceMediaService();
