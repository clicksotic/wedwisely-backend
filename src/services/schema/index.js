/**
 * Services Schema Index
 * Centralized export of all service-related schemas
 */

// Import schemas
const serviceSchema = require('./serviceSchema');
const serviceMediaSchema = require('./serviceMediaSchema');

// Import models
const Service = require('../models/Service');
const ServiceMedia = require('../models/ServiceMedia');

// Export schemas
module.exports = {
  // Raw schemas (for extending or custom use)
  schemas: {
    service: serviceSchema,
    serviceMedia: serviceMediaSchema,
  },
  
  // Models (for direct use)
  models: {
    Service,
    ServiceMedia,
  },
  
  // Schema information
  info: {
    service: {
      collection: 'services',
      description: 'Vendor services and offerings',
      fields: ['vendor', 'name', 'description', 'category', 'location', 'price', 'baseImage', 'isActive'],
      required: ['vendor', 'name', 'description', 'category', 'price', 'baseImage'],
      optional: ['location.city', 'location.country'],
      indexes: ['vendor', 'category', 'location.city', 'location.country', 'isActive']
    },
    serviceMedia: {
      collection: 'servicemedias',
      description: 'Media files associated with services',
      fields: ['service', 'mediaUrl', 'mediaType', 'uploadedBy', 'isActive'],
      required: ['service', 'mediaUrl', 'uploadedBy'],
      optional: ['mediaType'],
      indexes: ['service', 'uploadedBy', 'isActive']
    }
  }
};
