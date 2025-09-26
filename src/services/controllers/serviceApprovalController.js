const serviceApprovalService = require("../services/serviceApprovalService");
const { createError } = require("../../utils/errorHandler");

// Request approval for linking a service to an event
exports.requestServiceApproval = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can request service approvals"));
    }

    const { eventId, serviceId } = req.params;
    const approvalRequest = await serviceApprovalService.requestServiceApproval(
      eventId,
      serviceId,
      req.user.id
    );
    
    res.status(201).json({
      message: "Service approval request submitted successfully",
      data: approvalRequest,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get approval requests for service owners
exports.getApprovalRequestsForServiceOwner = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can view service approval requests"));
    }

    const { status } = req.query;
    const requests = await serviceApprovalService.getApprovalRequestsForServiceOwner(
      req.user.id,
      status
    );
    
    res.json({
      message: "Approval requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get approval requests made by a user
exports.getApprovalRequestsByUser = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can view their approval requests"));
    }

    const { status } = req.query;
    const requests = await serviceApprovalService.getApprovalRequestsByUser(
      req.user.id,
      status
    );
    
    res.json({
      message: "Your approval requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Approve a service request
exports.approveServiceRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can approve service requests"));
    }

    const { approvalId } = req.params;
    const { message } = req.body;
    
    const approval = await serviceApprovalService.approveServiceRequest(
      approvalId,
      req.user.id,
      message
    );
    
    res.json({
      message: "Service request approved successfully",
      data: approval,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Reject a service request
exports.rejectServiceRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can reject service requests"));
    }

    const { approvalId } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return next(createError(400, "Rejection reason is required"));
    }
    
    const approval = await serviceApprovalService.rejectServiceRequest(
      approvalId,
      req.user.id,
      rejectionReason
    );
    
    res.json({
      message: "Service request rejected successfully",
      data: approval,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get a single approval request
exports.getApprovalRequest = async (req, res, next) => {
  try {
    const { approvalId } = req.params;
    const approval = await serviceApprovalService.getApprovalRequest(
      approvalId,
      req.user.id,
      req.user.role
    );
    
    res.json({
      message: "Approval request retrieved successfully",
      data: approval,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Cancel an approval request
exports.cancelApprovalRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can cancel their approval requests"));
    }

    const { approvalId } = req.params;
    const result = await serviceApprovalService.cancelApprovalRequest(
      approvalId,
      req.user.id
    );
    
    res.json({
      message: result.message,
    });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Get approval statistics for service owner
exports.getApprovalStatsForServiceOwner = async (req, res, next) => {
  try {
    if (req.user.role !== "vendor") {
      return next(createError(403, "Only vendors can view approval statistics"));
    }

    const stats = await serviceApprovalService.getApprovalStatsForServiceOwner(
      req.user.id
    );
    
    res.json({
      message: "Approval statistics retrieved successfully",
      data: stats,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get approval statistics for user
exports.getApprovalStatsForUser = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Only users can view their approval statistics"));
    }

    const stats = await serviceApprovalService.getApprovalStatsForUser(
      req.user.id
    );
    
    res.json({
      message: "Your approval statistics retrieved successfully",
      data: stats,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Clean up expired approvals (admin only)
exports.cleanupExpiredApprovals = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Only admins can cleanup expired approvals"));
    }

    const result = await serviceApprovalService.cleanupExpiredApprovals();
    
    res.json({
      message: result.message,
      data: { count: result.count },
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all approval requests (admin only)
exports.getAllApprovalRequests = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Only admins can view all approval requests"));
    }

    const { status } = req.query;
    const requests = await serviceApprovalService.getAllApprovalRequests(status);
    
    res.json({
      message: "All approval requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};
