// Validation functions for Service Approval system

// For approving a service request
const approveServiceRequestSchema = (data) => {
  const errors = [];

  if (data.message && typeof data.message !== "string") {
    errors.push("Message must be a string");
  }

  if (data.message && data.message.length > 500) {
    errors.push("Message cannot exceed 500 characters");
  }

  return { error: errors.length > 0 ? errors : null };
};

// For rejecting a service request
const rejectServiceRequestSchema = (data) => {
  const errors = [];

  if (!data.rejectionReason) {
    errors.push("Rejection reason is required");
  } else if (typeof data.rejectionReason !== "string") {
    errors.push("Rejection reason must be a string");
  } else if (data.rejectionReason.length > 500) {
    errors.push("Rejection reason cannot exceed 500 characters");
  }

  return { error: errors.length > 0 ? errors : null };
};

module.exports = {
  approveServiceRequestSchema,
  rejectServiceRequestSchema,
};
