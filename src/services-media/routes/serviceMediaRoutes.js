/**
 * @swagger
 * tags:
 *   name: Service Images
 *   description: Service image storage and management
 */

const express = require("express");
const path = require("path");
const router = express.Router();
const serviceMediaController = require("../controllers/serviceMediaController");
const { authenticate } = require("../../auth/middleware/authMiddleware");

// Public routes - Get images
router.get("/service/:serviceId", serviceMediaController.getServiceImages);
router.get("/:imageId", serviceMediaController.getImage);

// Protected routes - Manage images
router.use(authenticate);

// Vendor routes
router.post("/service/:serviceId/upload", serviceMediaController.uploadImage);
router.post("/service/:serviceId/upload-multiple", serviceMediaController.uploadMultipleImages);
router.post("/service/:serviceId/add-url", serviceMediaController.addImageByUrl);
router.delete("/:imageId", serviceMediaController.deleteImage);


// Serve uploaded images from services-media folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
