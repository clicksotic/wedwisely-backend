# Services Module

This module handles vendor services and their media management for the WedWisely platform.

## Structure

```
src/services/
├── controllers/
│   └── serviceController.js
├── services/
│   └── serviceServices.js
├── models/
│   ├── Service.js
│   └── ServiceMedia.js
├── routes/
│   └── serviceRoutes.js
├── middleware/
│   └── serviceMiddleware.js
├── services-media/
│   ├── controllers/
│   │   └── serviceMediaController.js
│   ├── services/
│   │   └── serviceMediaServices.js
│   ├── routes/
│   │   └── serviceMediaRoutes.js
│   ├── middleware/
│   │   └── serviceMediaMiddleware.js
│   └── index.js
└── index.js
```

## Service Model

A service has the following fields:
- `vendor`: Reference to User (required)
- `name`: Service name (required, max 100 chars)
- `description`: Service description (required, max 500 chars)
- `category`: One of: Photography, Catering, Decoration, Music, Transportation, Venue, Others
- `location`: Object with city and country (both optional)
- `price`: Service price (required, non-negative)
- `baseImage`: Base image URL (required)
- `isActive`: Boolean (default: true)

## Service Media Model

Service media has the following fields:
- `service`: Reference to Service (required)
- `mediaUrl`: Media file URL (required)
- `mediaType`: "image" or "video" (default: "image")
- `uploadedBy`: Reference to User (required)
- `isActive`: Boolean (default: true)

## API Endpoints

### Services (Open to all)
- `GET /api/services` - Get all services with filters and pagination
- `GET /api/services/:id` - Get a specific service
- `GET /api/services/:id/media` - Get media for a service

### Services (Vendor only - requires authentication)
- `POST /api/services` - Create a new service
- `GET /api/services/my/services` - Get vendor's own services with filtering options
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service (soft delete)

### Service Media (Vendor only - requires authentication)
- `POST /api/services/:id/media` - Add media to a service
- `DELETE /api/services-media/:mediaId` - Delete service media

### Admin Endpoints (Admin only)
- `GET /api/services/admin/all` - Get all services (including inactive)
- `DELETE /api/services/admin/:id` - Permanently delete a service
- `GET /api/services-media/admin/all` - Get all media

## Query Parameters for GET /api/services

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `city`: Filter by city (case-insensitive partial match)
- `country`: Filter by country (case-insensitive partial match)
- `category`: Filter by category (exact match)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `availableDate`: Filter services available on specific date (YYYY-MM-DD format, excludes already booked services)

## Example API Calls

### Get all services
```
GET /api/services/cards
```

### Filter by category and location
```
GET /api/services/cards?category=Photography&city=Lahore
```

### Filter by available date
```
GET /api/services/cards?availableDate=2024-12-25
```

### Complex filtering
```
GET /api/services/cards?availableDate=2024-12-25&category=Photography&city=Lahore&minPrice=1000&maxPrice=5000&page=1&limit=10
```

### Get vendor's own services
```
GET /api/services/my/services
Authorization: Bearer <vendor-jwt-token>
```

### Filter vendor's services by category
```
GET /api/services/my/services?category=Photography
Authorization: Bearer <vendor-jwt-token>
```

### Filter vendor's services with pagination
```
GET /api/services/my/services?category=Catering&city=Lahore&page=1&limit=5
Authorization: Bearer <vendor-jwt-token>
```

## Example Service Creation

```json
{
  "name": "Go Carting",
  "description": "Fun go-carting experience for wedding guests",
  "category": "Others",
  "location": {
    "city": "Lahore",
    "country": "Pakistan"
  },
  "price": 12000,
  "baseImage": "base.png"
}
```

## Example Service Creation (Without Location)

```json
{
  "name": "Online Photography Consultation",
  "description": "Virtual photography consultation service",
  "category": "Photography",
  "price": 5000,
  "baseImage": "consultation.png"
}
```

## Example Service Media Addition

```json
{
  "mediaUrl": "1.png",
  "mediaType": "image"
}
```

## Authorization

- **Vendors**: Can create, update, delete their own services and add/delete media
- **Admins**: Can view all services/media and permanently delete them
- **Public**: Can view active services and their media
- **Service Media**: Can be deleted by the uploader, service owner, or admin

## Database Schema

### Service Collection
```javascript
{
  _id: ObjectId,
  vendor: ObjectId,           // Reference to User (required)
  name: String,               // Service name (required, max 100 chars)
  description: String,        // Service description (required, max 500 chars)
  category: String,           // Enum: Photography, Catering, etc. (required)
  location: {                 // Optional location object
    city: String,             // Optional
    country: String           // Optional
  },
  price: Number,              // Service price (required, min: 0)
  baseImage: String,          // Base image URL (required)
  isActive: Boolean,          // Active status (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### ServiceMedia Collection
```javascript
{
  _id: ObjectId,
  service: ObjectId,          // Reference to Service (required)
  mediaUrl: String,           // Media file URL (required)
  mediaType: String,          // "image" or "video" (default: "image")
  uploadedBy: ObjectId,       // Reference to User (required)
  isActive: Boolean,          // Active status (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## Database Schema

### Service Collection (`services`)

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  vendor: ObjectId,                 // Reference to User (required)
  name: String,                     // Service name (required, max 100 chars)
  description: String,              // Service description (required, max 500 chars)
  category: String,                 // Service category (required)
  location: {                       // Service location (optional)
    city: String,                   // City name (optional)
    country: String                 // Country name (optional)
  },
  price: Number,                    // Service price (required, min: 0)
  baseImage: String,                // Base image URL (required)
  isActive: Boolean,                // Service status (default: true)
  createdAt: Date,                  // Service creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

**Categories**: Photography, Catering, Decoration, Music, Transportation, Venue, Others

**Indexes**:
- `vendor` - For vendor-specific queries
- `category` - For category filtering
- `location.city` - For city-based searches
- `location.country` - For country-based searches
- `isActive` - For active/inactive filtering
- `price` - For price-based sorting

### ServiceMedia Collection (`servicemedias`)

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  service: ObjectId,                // Reference to Service (required)
  mediaUrl: String,                 // Media file URL (required)
  mediaType: String,                // Media type: "image" or "video" (default: "image")
  uploadedBy: ObjectId,             // Reference to User who uploaded (required)
  isActive: Boolean,                // Media status (default: true)
  createdAt: Date,                  // Media upload timestamp
  updatedAt: Date                   // Last update timestamp
}
```

**Indexes**:
- `service` - For service-specific media queries
- `uploadedBy` - For uploader-specific queries
- `isActive` - For active/inactive filtering
- `mediaType` - For media type filtering

### Relationships

- **User (vendor) → Services**: One vendor can have many services
- **Service → ServiceMedia**: One service can have many media files
- **User → ServiceMedia**: One user can upload many media files

### Example Documents

**Service Document:**
```json
{
  "_id": "68bb1831d21f2603f1b17f0a",
  "vendor": "68bb182ad21f2603f1b17f07",
  "name": "Go Carting",
  "description": "Fun go-carting experience for wedding guests",
  "category": "Others",
  "location": {
    "city": "Lahore",
    "country": "Pakistan"
  },
  "price": 12000,
  "baseImage": "base.png",
  "isActive": true,
  "createdAt": "2025-09-05T17:04:49.945Z",
  "updatedAt": "2025-09-05T17:04:49.945Z"
}
```

**ServiceMedia Document:**
```json
{
  "_id": "68bb1838d21f2603f1b17f0e",
  "service": "68bb1831d21f2603f1b17f0a",
  "mediaUrl": "1.png",
  "mediaType": "image",
  "uploadedBy": "68bb182ad21f2603f1b17f07",
  "isActive": true,
  "createdAt": "2025-09-05T17:04:56.787Z",
  "updatedAt": "2025-09-05T17:04:56.787Z"
}
```
