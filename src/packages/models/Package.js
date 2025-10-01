const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
      maxlength: [100, "Package name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, "Package description cannot exceed 500 characters"],
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    price: {
      type: Number,
      required: [true, "Package price is required"],
      min: [0, "Price cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
packageSchema.index({ vendor: 1 });
packageSchema.index({ isActive: 1 });
packageSchema.index({ name: 1 });

module.exports = mongoose.model("Package", packageSchema);


