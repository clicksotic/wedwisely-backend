/**
 * @swagger
 * tags:
 *   name: Event Services
 *   description: Event-Service linking management API
 */

/**
 * @swagger
 * /events/{eventId}/services/{serviceId}:
 *   post:
 *     summary: Request approval to add a service to an event (user only)
 *     tags: [Event Services]
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
 *         description: Forbidden (only users can request to add services to events)
 *       404:
 *         description: Event or service not found
 */

/**
 * @swagger
 * /events/{eventId}/services:
 *   get:
 *     summary: Get all services linked to an event
 *     tags: [Event Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *       403:
 *         description: Forbidden (only event owner or admin can access)
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{eventId}/services/{serviceId}:
 *   delete:
 *     summary: Remove a service from an event (user only)
 *     tags: [Event Services]
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
 *       200:
 *         description: Service removed from event successfully
 *       400:
 *         description: Service not linked to event
 *       403:
 *         description: Forbidden (only users can remove services from events)
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{eventId}/services/{serviceId}/status:
 *   put:
 *     summary: Update service status (user only)
 *     tags: [Event Services]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Service status updated successfully
 *       400:
 *         description: Invalid status or service not linked
 *       403:
 *         description: Forbidden (only users can update service status)
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{eventId}/services/{serviceId}/notes:
 *   put:
 *     summary: Add notes to a service (user only)
 *     tags: [Event Services]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Special requirements for this service"
 *     responses:
 *       200:
 *         description: Service notes updated successfully
 *       400:
 *         description: Service not linked to event
 *       403:
 *         description: Forbidden (only users can add notes to services)
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{eventId}/services/stats:
 *   get:
 *     summary: Get event service statistics
 *     tags: [Event Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event service statistics retrieved successfully
 *       403:
 *         description: Forbidden (only event owner or admin can access)
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /admin/services/{serviceId}/events:
 *   get:
 *     summary: Get all events that have a specific service (admin only)
 *     tags: [Event Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       403:
 *         description: Forbidden (only admins can access)
 *       404:
 *         description: Service not found
 */

const express = require("express");
const router = express.Router();
const eventServiceController = require("../controllers/eventServiceController");
const { authenticate } = require("../../auth/middleware/authMiddleware");
const { validateRequest } = require("../middleware/eventMiddleware");
const {
  updateServiceStatusSchema,
  addServiceNotesSchema,
} = require("../../validators/eventServiceValidators");

/**
 * Event Service Routes
 */

// Protected routes (auth required)
router.post(
  "/:eventId/services/:serviceId",
  authenticate,
  eventServiceController.addServiceToEvent
);

router.get(
  "/:eventId/services",
  authenticate,
  eventServiceController.getServicesByEvent
);

router.delete(
  "/:eventId/services/:serviceId",
  authenticate,
  eventServiceController.removeServiceFromEvent
);

router.put(
  "/:eventId/services/:serviceId/status",
  authenticate,
  validateRequest(updateServiceStatusSchema),
  eventServiceController.updateServiceStatus
);

router.put(
  "/:eventId/services/:serviceId/notes",
  authenticate,
  validateRequest(addServiceNotesSchema),
  eventServiceController.addServiceNotes
);

router.get(
  "/:eventId/services/stats",
  authenticate,
  eventServiceController.getEventServiceStats
);

// Admin routes
router.get(
  "/admin/services/:serviceId/events",
  authenticate,
  eventServiceController.getEventsByService
);

module.exports = router;
