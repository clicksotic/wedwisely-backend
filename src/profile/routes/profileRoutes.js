/**
 * @swagger
 * tags:
 *   name: Profile Management
 *   description: User profile management and location-based search API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - user
 *         - dateOfBirth
 *         - gender
 *         - age
 *         - phone
 *         - pinCode
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the profile
 *           example: "507f1f77bcf86cd799439011"
 *         user:
 *           type: string
 *           description: Reference to the user who owns this profile
 *           example: "507f1f77bcf86cd799439012"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *           example: "1990-01-15"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: User's gender
 *           example: "male"
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *           description: User's age
 *           example: 34
 *         phone:
 *           type: string
 *           pattern: '^\+?[1-9]\d{1,14}$'
 *           description: User's phone number in E.164 format
 *           example: "+1234567890"
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: Street address
 *               example: "123 Main Street"
 *             city:
 *               type: string
 *               description: City name
 *               example: "New York"
 *             state:
 *               type: string
 *               description: State or province
 *               example: "NY"
 *             country:
 *               type: string
 *               description: Country name
 *               example: "United States"
 *             coordinates:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [Point]
 *                   default: Point
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   minItems: 2
 *                   maxItems: 2
 *                   description: [longitude, latitude]
 *                   example: [-74.006, 40.7128]
 *         pinCode:
 *           type: string
 *           pattern: '^\d{4,10}$'
 *           description: Postal/ZIP code
 *           example: "10001"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Profile creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         calculatedAge:
 *           type: integer
 *           description: Computed age from dateOfBirth
 *           example: 34
 *     
 *     ProfileCreateRequest:
 *       type: object
 *       required:
 *         - dateOfBirth
 *         - gender
 *         - age
 *         - phone
 *         - pinCode
 *       properties:
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *           example: 34
 *         phone:
 *           type: string
 *           pattern: '^\+?[1-9]\d{1,14}$'
 *           example: "+1234567890"
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               example: "123 Main Street"
 *             city:
 *               type: string
 *               example: "New York"
 *             state:
 *               type: string
 *               example: "NY"
 *             country:
 *               type: string
 *               example: "United States"
 *             coordinates:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [Point]
 *                   default: Point
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   minItems: 2
 *                   maxItems: 2
 *                   example: [-74.006, 40.7128]
 *         pinCode:
 *           type: string
 *           pattern: '^\d{4,10}$'
 *           example: "10001"
 *     
 *     ProfileUpdateRequest:
 *       type: object
 *       properties:
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *           example: 34
 *         phone:
 *           type: string
 *           pattern: '^\+?[1-9]\d{1,14}$'
 *           example: "+1234567890"
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               example: "123 Main Street"
 *             city:
 *               type: string
 *               example: "New York"
 *             state:
 *               type: string
 *               example: "NY"
 *             country:
 *               type: string
 *               example: "United States"
 *             coordinates:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [Point]
 *                   default: Point
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   minItems: 2
 *                   maxItems: 2
 *                   example: [-74.006, 40.7128]
 *         pinCode:
 *           type: string
 *           pattern: '^\d{4,10}$'
 *           example: "10001"
 *     
 *     NearbySearchQuery:
 *       type: object
 *       required:
 *         - lat
 *         - lng
 *       properties:
 *         lat:
 *           type: number
 *           format: float
 *           description: Latitude coordinate
 *           example: 40.7128
 *         lng:
 *           type: number
 *           format: float
 *           description: Longitude coordinate
 *           example: -74.006
 *         distance:
 *           type: number
 *           format: float
 *           default: 10
 *           description: Search radius in kilometers
 *           example: 5
 *     
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Profile'
 *     
 *     NearbyProfilesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Profile'
 */

/**
 * @swagger
 * /profiles/create:
 *   post:
 *     summary: Create user profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileCreateRequest'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         description: Validation error or profile already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict - Profile already exists for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /profiles/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /profiles/update:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /profiles/delete:
 *   delete:
 *     summary: Delete current user's profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile deleted successfully"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /profiles/nearby/search:
 *   get:
 *     summary: Find profiles near a location
 *     tags: [Profile Management]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude coordinate
 *         example: 40.7128
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude coordinate
 *         example: -74.006
 *       - in: query
 *         name: distance
 *         schema:
 *           type: number
 *           format: float
 *           default: 10
 *         description: Search radius in kilometers
 *         example: 5
 *     responses:
 *       200:
 *         description: Nearby profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NearbyProfilesResponse'
 *       400:
 *         description: Invalid coordinates or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticate } = require("../../auth/middleware/authMiddleware");

// Public routes (optional, for geo search)
router.get("/nearby/search", profileController.findNearbyProfiles);

// Protected routes (auth required)
router.post("/create", authenticate, profileController.createProfile);
router.get("/me", authenticate, profileController.getMyProfile);
router.put("/update", authenticate, profileController.updateProfile);
router.delete("/delete", authenticate, profileController.deleteProfile);

module.exports = router;