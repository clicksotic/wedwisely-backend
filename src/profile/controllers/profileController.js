const profileService = require("../services/profileServices");

const { createError } = require("../../utils/errorHandler");

exports.createProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // from JWT
    const profile = await profileService.createProfile(userId, req.body);
    res.status(201).json(profile);
  } catch (err) {
    next(createError(400, err.message));
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    if (!profile) return next(createError(404, "Profile not found"));
    res.json(profile);
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    if (!profile) return next(createError(404, "Profile not found"));
    res.json(profile);
  } catch (err) {
    next(createError(400, err.message));
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const deleted = await profileService.deleteProfile(req.user.id);
    if (!deleted) return next(createError(404, "Profile not found"));
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.findNearbyProfiles = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.query;
    const profiles = await profileService.findProfilesNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(distance) || 10
    );
    res.json(profiles);
  } catch (err) {
    next(createError(400, err.message));
  }
};
