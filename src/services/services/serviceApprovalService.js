const ServiceApproval = require("../models/ServiceApproval");
const Event = require("../../event/models/Event");
const Service = require("../models/Service");
const EventService = require("../../event/models/EventService");

class ServiceApprovalService {
  // Request approval for linking a service to an event
  async requestServiceApproval(eventId, serviceId, userId) {
    // First verify the event exists and belongs to the user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      throw new Error("Event not found or you don't have permission to modify it");
    }

    // Verify the service exists and get its owner
    const service = await Service.findById(serviceId).populate("vendor");
    if (!service) {
      throw new Error("Service not found");
    }

    if (!service.isActive) {
      throw new Error("Service is not active");
    }

    // Check if there's already a pending or approved request
    const existingApproval = await ServiceApproval.findOne({ 
      event: eventId, 
      service: serviceId 
    });
    
    if (existingApproval) {
      if (existingApproval.status === "pending") {
        throw new Error("Approval request is already pending");
      } else if (existingApproval.status === "approved") {
        throw new Error("Service is already approved for this event");
      } else if (existingApproval.status === "rejected") {
        // Allow creating a new request if the previous one was rejected
        await ServiceApproval.findByIdAndDelete(existingApproval._id);
      }
    }

    // Check if service is already linked to the event
    const existingLink = await EventService.findOne({ event: eventId, service: serviceId });
    if (existingLink) {
      throw new Error("Service is already linked to this event");
    }

    // Create the approval request
    const approvalRequest = new ServiceApproval({
      event: eventId,
      service: serviceId,
      requestedBy: userId,
      serviceOwner: service.vendor._id,
      message: `Request to link service "${service.name}" to event on ${event.date}`,
    });

    return await approvalRequest.save();
  }

  // Get approval requests for a service owner
  async getApprovalRequestsForServiceOwner(serviceOwnerId, status = null) {
    const query = { serviceOwner: serviceOwnerId };
    if (status) {
      query.status = status;
    }

    return await ServiceApproval.find(query)
      .populate("event", "date location user")
      .populate("service", "name description category price")
      .populate("requestedBy", "firstName lastName email")
      .populate("serviceOwner", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  // Get approval requests made by a user
  async getApprovalRequestsByUser(userId, status = null) {
    const query = { requestedBy: userId };
    if (status) {
      query.status = status;
    }

    return await ServiceApproval.find(query)
      .populate("event", "date location user")
      .populate("service", "name description category price")
      .populate("requestedBy", "firstName lastName email")
      .populate("serviceOwner", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  // Approve a service request
  async approveServiceRequest(approvalId, serviceOwnerId, message = null) {
    const approval = await ServiceApproval.findOne({
      _id: approvalId,
      serviceOwner: serviceOwnerId,
      status: "pending"
    });

    if (!approval) {
      throw new Error("Approval request not found or already processed");
    }

    // Check if approval has expired
    if (approval.expiresAt && approval.expiresAt < new Date()) {
      throw new Error("Approval request has expired");
    }

    // Update approval status
    approval.status = "approved";
    if (message) {
      approval.message = message;
    }
    await approval.save();

    // Create the EventService entry
    const eventService = new EventService({
      event: approval.event,
      service: approval.service,
      addedBy: approval.requestedBy,
      status: "confirmed", // Auto-confirm when approved
    });

    await eventService.save();

    return approval;
  }

  // Reject a service request
  async rejectServiceRequest(approvalId, serviceOwnerId, rejectionReason) {
    const approval = await ServiceApproval.findOne({
      _id: approvalId,
      serviceOwner: serviceOwnerId,
      status: "pending"
    });

    if (!approval) {
      throw new Error("Approval request not found or already processed");
    }

    // Check if approval has expired
    if (approval.expiresAt && approval.expiresAt < new Date()) {
      throw new Error("Approval request has expired");
    }

    // Update approval status
    approval.status = "rejected";
    approval.rejectionReason = rejectionReason;
    await approval.save();

    return approval;
  }

  // Get a single approval request
  async getApprovalRequest(approvalId, userId, userRole) {
    const approval = await ServiceApproval.findById(approvalId)
      .populate("event", "date location user")
      .populate("service", "name description category price")
      .populate("requestedBy", "firstName lastName email")
      .populate("serviceOwner", "firstName lastName email");

    if (!approval) {
      throw new Error("Approval request not found");
    }

    // Check if user has permission to view this approval
    if (userRole !== "admin" && 
        approval.requestedBy._id.toString() !== userId && 
        approval.serviceOwner._id.toString() !== userId) {
      throw new Error("You don't have permission to view this approval request");
    }

    return approval;
  }

  // Cancel an approval request (only by the requester)
  async cancelApprovalRequest(approvalId, userId) {
    const approval = await ServiceApproval.findOne({
      _id: approvalId,
      requestedBy: userId,
      status: "pending"
    });

    if (!approval) {
      throw new Error("Approval request not found or already processed");
    }

    await ServiceApproval.findByIdAndDelete(approvalId);
    return { message: "Approval request cancelled successfully" };
  }

  // Get approval statistics for a service owner
  async getApprovalStatsForServiceOwner(serviceOwnerId) {
    const stats = await ServiceApproval.aggregate([
      { $match: { serviceOwner: serviceOwnerId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await ServiceApproval.countDocuments({ serviceOwner: serviceOwnerId });
    const pendingRequests = await ServiceApproval.countDocuments({ 
      serviceOwner: serviceOwnerId, 
      status: "pending" 
    });

    return {
      totalRequests,
      pendingRequests,
      statusBreakdown: stats,
    };
  }

  // Get approval statistics for a user (requester)
  async getApprovalStatsForUser(userId) {
    const stats = await ServiceApproval.aggregate([
      { $match: { requestedBy: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await ServiceApproval.countDocuments({ requestedBy: userId });
    const pendingRequests = await ServiceApproval.countDocuments({ 
      requestedBy: userId, 
      status: "pending" 
    });

    return {
      totalRequests,
      pendingRequests,
      statusBreakdown: stats,
    };
  }

  // Clean up expired approval requests (can be run as a cron job)
  async cleanupExpiredApprovals() {
    const expiredApprovals = await ServiceApproval.find({
      status: "pending",
      expiresAt: { $lt: new Date() }
    });

    for (const approval of expiredApprovals) {
      approval.status = "rejected";
      approval.rejectionReason = "Request expired";
      await approval.save();
    }

    return {
      message: `Cleaned up ${expiredApprovals.length} expired approval requests`,
      count: expiredApprovals.length
    };
  }

  // Get all approval requests (admin only)
  async getAllApprovalRequests(status = null) {
    const query = {};
    if (status) {
      query.status = status;
    }

    return await ServiceApproval.find(query)
      .populate("event", "date location user")
      .populate("service", "name description category price")
      .populate("requestedBy", "firstName lastName email")
      .populate("serviceOwner", "firstName lastName email")
      .sort({ createdAt: -1 });
  }
}

module.exports = new ServiceApprovalService();
