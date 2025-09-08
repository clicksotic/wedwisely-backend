# Services Schema Documentation

This folder contains the database schemas for the Services module.

## 📁 Files

- `serviceSchema.js` - Service collection schema definition
- `serviceMediaSchema.js` - ServiceMedia collection schema definition
- `index.js` - Centralized schema exports and information
- `README.md` - This documentation file

## 🗄️ Collections

### Service Collection (`services`)

**Purpose**: Store vendor services and offerings

**Schema Fields**:
- `vendor` (ObjectId, required) - Reference to User
- `name` (String, required, max 100 chars) - Service name
- `description` (String, required, max 500 chars) - Service description
- `category` (String, required) - Service category enum
- `location` (Object, optional) - Service location
  - `city` (String, optional) - City name
  - `country` (String, optional) - Country name
- `price` (Number, required, min: 0) - Service price
- `baseImage` (String, required) - Base image URL
- `isActive` (Boolean, default: true) - Service status
- `createdAt` (Date, auto) - Creation timestamp
- `updatedAt` (Date, auto) - Last update timestamp

**Categories**: Photography, Catering, Decoration, Music, Transportation, Venue, Others

**Indexes**:
- `vendor` - For vendor-specific queries
- `category` - For category filtering
- `location.city` - For city-based searches
- `location.country` - For country-based searches
- `isActive` - For active/inactive filtering

### ServiceMedia Collection (`servicemedias`)

**Purpose**: Store media files associated with services

**Schema Fields**:
- `service` (ObjectId, required) - Reference to Service
- `mediaUrl` (String, required) - Media file URL
- `mediaType` (String, required) - "image" or "video" (default: "image")
- `uploadedBy` (ObjectId, required) - Reference to User who uploaded
- `isActive` (Boolean, default: true) - Media status
- `createdAt` (Date, auto) - Upload timestamp
- `updatedAt` (Date, auto) - Last update timestamp

**Indexes**:
- `service` - For service-specific media queries
- `uploadedBy` - For uploader-specific queries
- `isActive` - For active/inactive filtering

## 🔗 Relationships

- **User (vendor) → Services**: One vendor can have many services
- **Service → ServiceMedia**: One service can have many media files
- **User → ServiceMedia**: One user can upload many media files

## 📖 Usage

### Import Schemas

```javascript
// Import all schemas
const { schemas, models, info } = require('./schema');

// Use raw schemas
const serviceSchema = schemas.service;
const serviceMediaSchema = schemas.serviceMedia;

// Use models
const Service = models.Service;
const ServiceMedia = models.ServiceMedia;

// Access schema information
console.log(info.service.fields); // ['vendor', 'name', 'description', ...]
```

### Schema Information

```javascript
const { info } = require('./schema');

// Get service schema info
console.log(info.service.collection); // 'services'
console.log(info.service.required); // ['vendor', 'name', 'description', 'category', 'price', 'baseImage']
console.log(info.service.optional); // ['location.city', 'location.country']
console.log(info.service.indexes); // ['vendor', 'category', 'location.city', 'location.country', 'isActive']
```

## 🔧 Schema Management

### Adding New Fields

1. Update the schema file (`serviceSchema.js` or `serviceMediaSchema.js`)
2. Update the model file in `../models/`
3. Update the schema information in `index.js`
4. Run database migration if needed

### Validation

All schemas include:
- **Field validation** - Type checking, required fields, length limits
- **Enum validation** - Category and media type validation
- **Custom validation** - Price minimum, email format, etc.
- **Index optimization** - Performance indexes for common queries

## 📚 Related Files

- `../models/Service.js` - Service model implementation
- `../models/ServiceMedia.js` - ServiceMedia model implementation
- `../../validators/serviceValidators.js` - Input validation schemas
- `../routes/serviceRoutes.js` - API route definitions
- `../../SERVICES_README.md` - Complete services documentation
