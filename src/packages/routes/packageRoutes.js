/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management API for vendors
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PackageCard:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Package ID
 *         name:
 *           type: string
 *           description: Package name
 *         price:
 *           type: number
 *           description: Package price
 *         servicesCount:
 *           type: integer
 *           description: Number of services in the package
 *         baseImage:
 *           type: string
 *           description: Image derived from the first service's first media
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
 *     PackageDetails:
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
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *         price:
 *           type: number
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const { validateRequest } = require("../middleware/packageMiddleware");
const {
  createPackageSchema,
  updatePackageSchema,
  getAllPackagesSchema,
} = require("../../validators/packageValidators");
const { authenticate } = require("../../auth/middleware/authMiddleware");

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all packages (with pagination and filters)
 *     tags: [Packages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "2025-10-01"
 *         description: Only show packages whose all services are available on this date
 *     responses:
 *       200:
 *         description: List of packages
 */
router.get("/", validateRequest(getAllPackagesSchema, "query"), packageController.getAllPackages);

/**
 * @swagger
 * /packages/cards:
 *   get:
 *     summary: Get all package cards (minimal data for frontend listing)
 *     tags: [Packages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "2025-10-01"
 *         description: Only show packages whose all services are available on this date
 *     responses:
 *       200:
 *         description: List of package cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 packages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PackageCard'
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
 */
router.get("/cards", validateRequest(getAllPackagesSchema, "query"), packageController.getAllPackageCards);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a package by ID (with nested services)
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Package details
 *       404:
 *         description: Package not found
 */
router.get("/:id", packageController.getPackage);

/**
 * @swagger
 * /packages/cards/{id}:
 *   get:
 *     summary: Get a single package card by ID (minimal data for frontend cards)
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Package card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageCard'
 *       404:
 *         description: Package not found
 */
router.get("/cards/:id", packageController.getPackageCard);

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new package (vendor only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Package created
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, validateRequest(createPackageSchema), packageController.createPackage);

/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Update a package (owner only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Package updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Package not found
 */
router.put("/:id", authenticate, validateRequest(updatePackageSchema), packageController.updatePackage);

/**
 * @swagger
 * /packages/{id}:
 *   delete:
 *     summary: Soft delete a package (owner or admin)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Package deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Package not found
 */
router.delete("/:id", authenticate, packageController.deletePackage);

module.exports = router;


