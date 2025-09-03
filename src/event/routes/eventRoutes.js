/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management API
 */

/**
 * @swagger
 * /events/create:
 *   post:
 *     summary: Create a new event (user only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-15
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "London"
 *                   country:
 *                     type: string
 *                     example: "UK"
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error or duplicate event
 *       403:
 *         description: Forbidden (only users can create events)
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by ID (only if it belongs to the logged-in user)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/me/all:
 *   get:
 *     summary: Get all events created by the logged-in user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user events
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/update/{id}:
 *   put:
 *     summary: Update an event (date or location)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-20
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "Paris"
 *                   country:
 *                     type: string
 *                     example: "France"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Event not found or not authorized
 */

/**
 * @swagger
 * /events/delete/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found or not authorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/all:
 *   get:
 *     summary: Get all events (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of results per page
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: "Berlin"
 *         description: Filter by city
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           example: "Germany"
 *         description: Filter by country
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-09-01
 *         description: Filter by date
 *     responses:
 *       200:
 *         description: List of all events
 *       403:
 *         description: Forbidden (only admins can access)
 *       500:
 *         description: Server error
 */



const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticate } = require("../../auth/middleware/authMiddleware");
const { validateRequest } = require("../middleware/eventMiddleware");
const {
  createEventSchema,
  updateEventSchema,
  getAllEventsSchema,
} = require("../../validators/eventValidators");

/**
 * Event Routes
 */

// Protected routes (auth required)
router.post(
  "/create",
  authenticate,
  validateRequest(createEventSchema),
  eventController.createEvent
);

router.get("/me/all", authenticate, eventController.getMyEvents);

router.get(
  "/all", // admin-only
  authenticate,
  validateRequest(getAllEventsSchema, "query"), // validate query params
  eventController.getAllEvents
);

router.put(
  "/update/:id",
  authenticate,
  validateRequest(updateEventSchema),
  eventController.updateEvent
);

router.delete("/delete/:id", authenticate, eventController.deleteEvent);

// ⚠️ Keep this last so it doesn’t override `/me/all` and `/all`
router.get("/:id", authenticate, eventController.getEvent);

module.exports = router;

