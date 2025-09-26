const mongoose = require("mongoose");

const serviceApprovalSchema = new mongoose.Schema(
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
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requested by user is required"],
    },
    serviceOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Service owner is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: function() {
        // Approval requests expire after 7 days
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
serviceApprovalSchema.index({ event: 1 });
serviceApprovalSchema.index({ service: 1 });
serviceApprovalSchema.index({ requestedBy: 1 });
serviceApprovalSchema.index({ serviceOwner: 1 });
serviceApprovalSchema.index({ status: 1 });
serviceApprovalSchema.index({ expiresAt: 1 });

// Compound index to prevent duplicate approval requests
serviceApprovalSchema.index({ event: 1, service: 1 }, { unique: true });

// Virtual for checking if approval is expired
serviceApprovalSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Pre-save middleware to set timestamps
serviceApprovalSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'approved') {
      this.approvedAt = new Date();
    } else if (this.status === 'rejected') {
      this.rejectedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model("ServiceApproval", serviceApprovalSchema);
