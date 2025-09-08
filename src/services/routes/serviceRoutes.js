/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management API for vendors
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceCard:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Service ID
 *         name:
 *           type: string
 *           description: Service name
 *         category:
 *           type: string
 *           enum: [Photography, Catering, Decoration, Music, Transportation, Venue, Others]
 *         price:
 *           type: number
 *           description: Service price
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             country:
 *               type: string
 *         baseImage:
 *           type: string
 *           description: First uploaded image URL
 *         vendor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             profilePicture:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     ServiceDetails:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         vendor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             profilePicture:
 *               type: string
 *             phone:
 *               type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             country:
 *               type: string
 *         price:
 *           type: number
 *         baseImage:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *               mediaType:
 *                 type: string
 *               createdAt:
 *                 type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { validateRequest } = require("../middleware/serviceMiddleware");
const {
  createServiceSchema,
  updateServiceSchema,
  getAllServicesSchema,
} = require("../../validators/serviceValidators");
const { authenticate } = require("../../auth/middleware/authMiddleware");

/**
 * @swagger
 * /services/cards:
 *   get:
 *     summary: Get all service cards (minimal data for frontend listing)
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of services per page
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Photography, Catering, Decoration, Music, Transportation, Venue, Others]
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of service cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceCard'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       400:
 *         description: Validation error
 */
router.get("/cards", validateRequest(getAllServicesSchema, "query"), serviceController.getAllServiceCards);

/**
 * @swagger
 * /services/cards/{id}:
 *   get:
 *     summary: Get a single service card by ID (minimal data for frontend cards)
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Service card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceCard'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get("/cards/:id", serviceController.getServiceCard);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get full service details by ID (complete data with all images)
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The service ID
 *     responses:
 *       200:
 *         description: Service details found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceDetails'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get("/:id", serviceController.getService);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service (vendor only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Wedding Photography"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Professional wedding photography services"
 *               category:
 *                 type: string
 *                 enum: [Photography, Catering, Decoration, Music, Transportation, Venue, Others]
 *                 example: "Photography"
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "Lahore"
 *                   country:
 *                     type: string
 *                     example: "Pakistan"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 12000
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceDetails'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (only vendors can create services)
 */
router.post("/", authenticate, validateRequest(createServiceSchema), serviceController.createService);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service (owner only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               category:
 *                 type: string
 *                 enum: [Photography, Catering, Decoration, Music, Transportation, Venue, Others]
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceDetails'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (only owner can update service)
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticate, validateRequest(updateServiceSchema), serviceController.updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Soft delete a service (owner or admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID to delete
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service deleted successfully"
 *       403:
 *         description: Forbidden (only owner or admin can delete service)
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticate, serviceController.deleteService);

module.exports = router;
