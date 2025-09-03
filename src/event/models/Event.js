const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"], // Every event must belong to a user
    },
    date: {
      type: Date,
      required: false, // Optional event date
    },
    location: {
      city: {
        type: String,
        trim: true,
        required: false,
      },
      country: {
        type: String,
        trim: true,
        required: false,
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
eventSchema.index({ "location.city": 1 });
eventSchema.index({ "location.country": 1 });

module.exports = mongoose.model("Event", eventSchema);
