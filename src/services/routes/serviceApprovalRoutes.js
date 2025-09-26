/**
 * @swagger
 * tags:
 *   name: Service Approvals
 *   description: Service approval management API
 */

/**
 * @swagger
 * /services/approvals/request/{eventId}/{serviceId}:
 *   post:
 *     summary: Request approval to link a service to an event (user only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The service ID
 *     responses:
 *       201:
 *         description: Service approval request submitted successfully
 *       400:
 *         description: Validation error or service already linked
 *       403:
 *         description: Forbidden (only users can request approvals)
 *       404:
 *         description: Event or service not found
 */

/**
 * @swagger
 * /services/approvals/my-requests:
 *   get:
 *     summary: Get approval requests made by the current user (user only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by approval status
 *     responses:
 *       200:
 *         description: Approval requests retrieved successfully
 *       403:
 *         description: Forbidden (only users can view their requests)
 */

/**
 * @swagger
 * /services/approvals/service-owner:
 *   get:
 *     summary: Get approval requests for service owner (vendor only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by approval status
 *     responses:
 *       200:
 *         description: Approval requests retrieved successfully
 *       403:
 *         description: Forbidden (only vendors can view service requests)
 */

/**
 * @swagger
 * /services/approvals/{approvalId}:
 *   get:
 *     summary: Get a single approval request
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: approvalId
 *         schema:
 *           type: string
 *         required: true
 *         description: The approval ID
 *     responses:
 *       200:
 *         description: Approval request retrieved successfully
 *       403:
 *         description: Forbidden (only requester, service owner, or admin can view)
 *       404:
 *         description: Approval request not found
 */

/**
 * @swagger
 * /services/approvals/{approvalId}/approve:
 *   put:
 *     summary: Approve a service request (vendor only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: approvalId
 *         schema:
 *           type: string
 *         required: true
 *         description: The approval ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Approved with special conditions"
 *     responses:
 *       200:
 *         description: Service request approved successfully
 *       400:
 *         description: Approval request not found or already processed
 *       403:
 *         description: Forbidden (only vendors can approve requests)
 */

/**
 * @swagger
 * /services/approvals/{approvalId}/reject:
 *   put:
 *     summary: Reject a service request (vendor only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: approvalId
 *         schema:
 *           type: string
 *         required: true
 *         description: The approval ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Not available on requested date"
 *     responses:
 *       200:
 *         description: Service request rejected successfully
 *       400:
 *         description: Approval request not found or already processed
 *       403:
 *         description: Forbidden (only vendors can reject requests)
 */

/**
 * @swagger
 * /services/approvals/{approvalId}/cancel:
 *   delete:
 *     summary: Cancel an approval request (user only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: approvalId
 *         schema:
 *           type: string
 *         required: true
 *         description: The approval ID
 *     responses:
 *       200:
 *         description: Approval request cancelled successfully
 *       400:
 *         description: Approval request not found or already processed
 *       403:
 *         description: Forbidden (only users can cancel their requests)
 */

/**
 * @swagger
 * /services/approvals/stats/my-requests:
 *   get:
 *     summary: Get approval statistics for current user (user only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approval statistics retrieved successfully
 *       403:
 *         description: Forbidden (only users can view their statistics)
 */

/**
 * @swagger
 * /services/approvals/stats/service-owner:
 *   get:
 *     summary: Get approval statistics for service owner (vendor only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approval statistics retrieved successfully
 *       403:
 *         description: Forbidden (only vendors can view statistics)
 */

/**
 * @swagger
 * /services/approvals/admin/all:
 *   get:
 *     summary: Get all approval requests (admin only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by approval status
 *     responses:
 *       200:
 *         description: All approval requests retrieved successfully
 *       403:
 *         description: Forbidden (only admins can view all requests)
 */

/**
 * @swagger
 * /services/approvals/admin/cleanup:
 *   post:
 *     summary: Clean up expired approval requests (admin only)
 *     tags: [Service Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired approvals cleaned up successfully
 *       403:
 *         description: Forbidden (only admins can cleanup)
 */

const express = require("express");
const router = express.Router();
const serviceApprovalController = require("../controllers/serviceApprovalController");
const { authenticate } = require("../../auth/middleware/authMiddleware");
const { validateRequest } = require("../middleware/serviceMiddleware");
const {
  approveServiceRequestSchema,
  rejectServiceRequestSchema,
} = require("../../validators/serviceApprovalValidators");

/**
 * Service Approval Routes
 */

// Protected routes (auth required)
router.post(
  "/approvals/request/:eventId/:serviceId",
  authenticate,
  serviceApprovalController.requestServiceApproval
);

router.get(
  "/approvals/my-requests",
  authenticate,
  serviceApprovalController.getApprovalRequestsByUser
);

router.get(
  "/approvals/service-owner",
  authenticate,
  serviceApprovalController.getApprovalRequestsForServiceOwner
);

router.get(
  "/approvals/:approvalId",
  authenticate,
  serviceApprovalController.getApprovalRequest
);

router.put(
  "/approvals/:approvalId/approve",
  authenticate,
  validateRequest(approveServiceRequestSchema),
  serviceApprovalController.approveServiceRequest
);

router.put(
  "/approvals/:approvalId/reject",
  authenticate,
  validateRequest(rejectServiceRequestSchema),
  serviceApprovalController.rejectServiceRequest
);

router.delete(
  "/approvals/:approvalId/cancel",
  authenticate,
  serviceApprovalController.cancelApprovalRequest
);

router.get(
  "/approvals/stats/my-requests",
  authenticate,
  serviceApprovalController.getApprovalStatsForUser
);

router.get(
  "/approvals/stats/service-owner",
  authenticate,
  serviceApprovalController.getApprovalStatsForServiceOwner
);

// Admin routes
router.get(
  "/approvals/admin/all",
  authenticate,
  serviceApprovalController.getAllApprovalRequests
);

router.post(
  "/approvals/admin/cleanup",
  authenticate,
  serviceApprovalController.cleanupExpiredApprovals
);

module.exports = router;
