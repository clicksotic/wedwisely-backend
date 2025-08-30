const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true, // One profile per user
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    age: {
      type: Number,
      min: [0, "Age must be positive"],
      max: [120, "Age seems invalid"],
      required: [true, "Age is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"], // E.164 format
    },
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: {
          type: [Number],
          index: "2dsphere", // [lng, lat]
          validate: {
            validator: function (val) {
              return val.length === 2;
            },
            message: "Coordinates must be [longitude, latitude]",
          },
        },
      },
    },
    pinCode: {
      type: String,
      required: [true, "Pin code is required"],
      match: [/^\d{4,10}$/, "Please enter a valid pin code"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for performance
profileSchema.index({ gender: 1 });
profileSchema.index({ "location.city": 1 });
profileSchema.index({ pinCode: 1 });

// Virtual to compute age dynamically (optional — if you don’t want manual input)
profileSchema.virtual("calculatedAge").get(function () {
  if (!this.dateOfBirth) return null;
  const diffMs = Date.now() - this.dateOfBirth.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
});

// Static method to find profiles nearby
profileSchema.statics.findNearby = function (lng, lat, distanceKm) {
  return this.find({
    "location.coordinates": {
      $nearSphere: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: distanceKm * 1000, // km → meters
      },
    },
  });
};

module.exports = mongoose.model("Profile", profileSchema);
