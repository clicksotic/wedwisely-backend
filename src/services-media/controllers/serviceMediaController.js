const serviceMediaService = require("../services/serviceMediaServices");
const { createError } = require("../../utils/errorHandler");
const { uploadSingle, uploadMultiple } = require("../middleware/uploadMiddleware");

// Get all images for a service
exports.getServiceImages = async (req, res, next) => {
  try {
    const images = await serviceMediaService.getServiceImages(req.params.serviceId);
    res.json(images);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Upload single image to service (vendor only)
exports.uploadImage = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can upload images"));
    }

    // Use multer middleware
    uploadSingle(req, res, async (err) => {
      if (err) {
        return next(createError(400, err.message));
      }

      if (!req.file) {
        return next(createError(400, "No image file provided"));
      }

      const serviceId = req.params.serviceId;
      const imageUrl = `/api/services-media/uploads/${req.file.filename}`; // Relative path

      const image = await serviceMediaService.addImage(serviceId, imageUrl, req.user.id);
      res.status(201).json({
        message: "Image uploaded successfully",
        image: image
      });
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Upload multiple images to service (vendor only)
exports.uploadMultipleImages = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can upload images"));
    }

    // Use multer middleware
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return next(createError(400, err.message));
      }

      if (!req.files || req.files.length === 0) {
        return next(createError(400, "No image files provided"));
      }

      const serviceId = req.params.serviceId;
      const uploadedImages = [];

      // Process each uploaded file
      for (const file of req.files) {
        const imageUrl = `/api/services-media/uploads/${file.filename}`;
        const image = await serviceMediaService.addImage(serviceId, imageUrl, req.user.id);
        uploadedImages.push(image);
      }

      res.status(201).json({
        message: `${uploadedImages.length} images uploaded successfully`,
        images: uploadedImages
      });
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Add image by URL (for existing images)
exports.addImageByUrl = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can add images"));
    }

    const serviceId = req.params.serviceId;
    const imageUrl = req.body.imageUrl;

    if (!imageUrl) {
      return next(createError(400, "Image URL is required"));
    }

    const image = await serviceMediaService.addImage(serviceId, imageUrl, req.user.id);
    res.status(201).json({
      message: "Image added successfully",
      image: image
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Delete image (vendor or admin)
exports.deleteImage = async (req, res, next) => {
  try {
    const deleted = await serviceMediaService.deleteImage(
      req.params.imageId,
      req.user.id,
      req.user.role
    );
    if (!deleted)
      return next(createError(404, "Image not found or not authorized"));
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get image by ID
exports.getImage = async (req, res, next) => {
  try {
    const image = await serviceMediaService.getImage(req.params.imageId);
    if (!image) return next(createError(404, "Image not found"));
    res.json(image);
  } catch (err) {
    next(createError(500, err.message));
  }
};
