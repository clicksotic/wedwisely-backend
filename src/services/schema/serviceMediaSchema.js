/**
 * ServiceMedia Database Schema
 * MongoDB schema definition for ServiceMedia collection
 */

const mongoose = require("mongoose");

const serviceMediaSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"], // Every media must belong to a service
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
      trim: true,
    },
    mediaType: {
      type: String,
      required: [true, "Media type is required"],
      enum: ["image", "video"],
      default: "image",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
serviceMediaSchema.index({ service: 1 });
serviceMediaSchema.index({ uploadedBy: 1 });
serviceMediaSchema.index({ isActive: 1 });

module.exports = serviceMediaSchema;
