const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticate } = require("../../auth/middleware/authMiddleware");

// Public routes (optional, for geo search)
router.get("/nearby/search", profileController.findNearbyProfiles);

// Protected routes (auth required)
router.post("/create", authenticate, profileController.createProfile);
router.get("/me", authenticate, profileController.getMyProfile);
router.put("/update", authenticate, profileController.updateProfile);
router.delete("/delete", authenticate, profileController.deleteProfile);

module.exports = router;