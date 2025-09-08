/**
 * Service Database Schema
 * MongoDB schema definition for Service collection
 */

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"], // Every service must belong to a vendor
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [500, "Service description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
      enum: ["Photography", "Catering", "Decoration", "Music", "Transportation", "Venue", "Others"],
    },
    location: {
      city: {
        type: String,
        required: false, // Made optional
        trim: true,
      },
      country: {
        type: String,
        required: false, // Made optional
        trim: true,
      },
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price cannot be negative"],
    },
    baseImage: {
      type: String,
      required: [true, "Base image is required"],
      trim: true,
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
serviceSchema.index({ "location.city": 1 });
serviceSchema.index({ "location.country": 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ vendor: 1 });
serviceSchema.index({ isActive: 1 });

module.exports = serviceSchema;
