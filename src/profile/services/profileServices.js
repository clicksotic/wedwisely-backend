const Profile = require("../models/profile");

class ProfileService {
  async createProfile(userId, data) {
    const existing = await Profile.findOne({ user: userId });
    if (existing) throw new Error("Profile already exists for this user");

    let location = undefined;
    if (data.location) {
      location = {
        address: data.location.address,
        city: data.location.city,
        state: data.location.state,
        country: data.location.country,
      };

      if (
        data.location.coordinates &&
        data.location.coordinates.lat != null &&
        data.location.coordinates.lng != null
      ) {
        location.coordinates = {
          type: "Point",
          coordinates: [
            data.location.coordinates.lng,
            data.location.coordinates.lat,
          ],
        };
      }
    }

    const profile = new Profile({
      user: userId,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      age: data.age,
      phone: data.phone,
      location,
      pinCode: data.pinCode,
    });

    return await profile.save();
  }

  async getProfile(userId) {
    return await Profile.findOne({ user: userId }).populate("user", "firstName lastName email");
  }

  async updateProfile(userId, updates) {
    if (updates.location?.coordinates) {
      if (
        updates.location.coordinates.lat != null &&
        updates.location.coordinates.lng != null
      ) {
        updates.location.coordinates = {
          type: "Point",
          coordinates: [
            updates.location.coordinates.lng,
            updates.location.coordinates.lat,
          ],
        };
      } else {
        delete updates.location.coordinates; // remove invalid coordinates
      }
    }

    return await Profile.findOneAndUpdate({ user: userId }, updates, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProfile(userId) {
    return await Profile.findOneAndDelete({ user: userId });
  }

  async findProfilesNearby(lat, lng, distanceKm = 10) {
    if (lat == null || lng == null) throw new Error("Latitude and longitude required");
    return await Profile.find({
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: distanceKm * 1000,
        },
      },
    });
  }
}

module.exports = new ProfileService();
