const mongoose = require("mongoose");

const eventServiceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Added by user is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
eventServiceSchema.index({ event: 1 });
eventServiceSchema.index({ service: 1 });
eventServiceSchema.index({ addedBy: 1 });
eventServiceSchema.index({ status: 1 });

// Compound index to prevent duplicate event-service pairs
eventServiceSchema.index({ event: 1, service: 1 }, { unique: true });

module.exports = mongoose.model("EventService", eventServiceSchema);
