const express = require('express');
const path = require("path");
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('./config');
const database = require('./config/database');
const { globalErrorHandler } = require('./src/utils/errorHandler');

const app = express();
const serverConfig = config.getServerConfig();
const corsConfig = config.getCorsConfig();
const loggingConfig = config.getLoggingConfig();
const featuresConfig = config.getFeaturesConfig();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Security middleware (conditional based on environment)
if (featuresConfig.enableHelmet) {
  app.use(helmet());
}

// CORS configuration
app.use(cors(corsConfig));

// Compression middleware (conditional)
if (featuresConfig.enableCompression) {
  app.use(compression());
}

// Rate limiting (conditional)
if (featuresConfig.enableRateLimit) {
  const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      timestamp: new Date().toISOString()
    }
  });
  app.use('/api/', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files FIRST (before any other routes)
app.use(express.static('public'));

// Explicit route for the token extractor script
app.get('/swagger-token-extractor.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'swagger-token-extractor.js'));
});

// Request logging (conditional)
if (loggingConfig.enableRequestLogging) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Database connection middleware
app.use(async (req, res, next) => {
  if (!database.isConnected) {
    try {
      await database.connect();
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: error.message,
        environment: config.currentEnvironment
      });
    }
  }
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WedWisely Backend API',
    status: 'Server is running',
    environment: config.currentEnvironment,
    database: database.getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Health check with database status
app.get('/health', async (req, res) => {
  const dbHealth = await database.healthCheck();
  
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    environment: config.currentEnvironment,
    database: dbHealth,
    timestamp: new Date().toISOString()
  });
});

// Environment info endpoint
app.get('/api/environment', (req, res) => {
  res.json({
    success: true,
    data: {
      environment: config.currentEnvironment,
      server: serverConfig,
      database: database.getStatus(),
      features: featuresConfig
    }
  });
});

// Database status endpoint
app.get('/api/db/status', (req, res) => {
  res.json({
    success: true,
    data: database.getStatus()
  });
});

// Authentication routes
app.use('/api/auth', require('./src/auth/routes/authRoutes'));

// User management routes
app.use('/api/users', require('./src/auth/routes/userRoutes'));

// Profile routes
app.use('/api/profiles', require('./src/profile/routes/profileRoutes'));

// Events routes
app.use('/api/events', require('./src/event/routes/eventRoutes'));

// Event-Service linking routes
app.use('/api/events', require('./src/event/routes/eventServiceRoutes'));

// Services routes
app.use('/api/services', require('./src/services/routes/serviceRoutes'));

// Service Approval routes
app.use('/api/services', require('./src/services/routes/serviceApprovalRoutes'));

// Service Media routes
app.use("/api/services-media", require("./src/services-media/routes/serviceMediaRoutes"));

// Packages routes
app.use('/api/packages', require('./src/packages/routes/packageRoutes'));

// Swagger routes with enhanced configuration
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      return req;
    },
    responseInterceptor: (res) => {
      return res;
    }
  },
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .swagger-ui .auth-wrapper { margin: 20px 0; }
    .swagger-ui .auth-container { background: #f1f5f9; padding: 15px; border-radius: 6px; }
    .swagger-ui .auth-btn-wrapper { margin: 10px 0; }
    .swagger-ui .auth-btn-wrapper .btn-done { background: #10b981; }
    .swagger-ui .auth-btn-wrapper .btn-done:hover { background: #059669; }
    .swagger-ui .response-col_description__inner { position: relative; }
    .auto-token-btn { 
      background: #10b981; 
      color: white; 
      border: none; 
      padding: 8px 16px; 
      border-radius: 4px; 
      cursor: pointer; 
      margin: 10px 0;
      font-size: 12px;
    }
    .auto-token-btn:hover { background: #059669; }
  `,
  customSiteTitle: "WedWisely API Documentation",
  customJs: `
    console.log('🚀 Swagger UI custom JS executing immediately');
    console.log('🔍 Document ready state:', document.readyState);
    console.log('🔍 Current URL:', window.location.href);
    
    // Load external token extractor
    const script = document.createElement('script');
    script.src = '/swagger-token-extractor.js';
    script.onload = function() {
      console.log('✅ External token extractor loaded');
    };
    script.onerror = function() {
      console.log('❌ Failed to load external token extractor');
    };
    document.head.appendChild(script);
    
    console.log('✅ Script element added to head');
  `
}));

// Test endpoint for static files
app.get('/test-js', (req, res) => {
  res.json({ 
    message: 'Static file serving is working',
    timestamp: new Date().toISOString()
  });
});

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'API is working',
    version: '1.0.0',
    environment: config.currentEnvironment,
    database: database.getStatus(),
    endpoints: [
          '/',
          '/health', 
          '/api',
          '/api/environment', 
          '/api/db/status',
          '/api/auth/register',
          '/api/auth/login',
          '/api/auth/me',
          '/api/users/all',
        
          // 👇 Profile endpoints
          '/api/profiles',
          '/api/profiles/me',
          '/api/profiles/create',
          '/api/profiles/update',
          '/api/profiles/delete',
        
          // 👇 Event endpoints
          '/api/events/create',
          '/api/events/:id',
          '/api/events/me/all',
          '/api/events/update/:id',
          '/api/events/delete/:id',
          '/api/events/all',
          
          // 👇 Event-Service linking endpoints
          '/api/events/:eventId/services',
          '/api/events/:eventId/services/:serviceId',
          '/api/events/:eventId/services/:serviceId/status',
          '/api/events/:eventId/services/:serviceId/notes',
          '/api/events/:eventId/services/stats',
          '/api/events/admin/services/:serviceId/events',
        
          // 👇 Service endpoints
          '/api/services',
          '/api/services/:id',
          '/api/services/my/services',
          '/api/services/:id/media',
          '/api/services/admin/all',
          
          // 👇 Service Approval endpoints
          '/api/services/approvals/request/:eventId/:serviceId',
          '/api/services/approvals/my-requests',
          '/api/services/approvals/service-owner',
          '/api/services/approvals/:approvalId',
          '/api/services/approvals/:approvalId/approve',
          '/api/services/approvals/:approvalId/reject',
          '/api/services/approvals/:approvalId/cancel',
          '/api/services/approvals/stats/my-requests',
          '/api/services/approvals/stats/service-owner',
          '/api/services/approvals/admin/all',
          '/api/services/approvals/admin/cleanup',
        ]
  });
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    environment: config.currentEnvironment
  });
});

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(serverConfig.port, serverConfig.host, () => {
  console.log(`🚀 Server running on ${serverConfig.host}:${serverConfig.port}`);
  console.log(`🌍 Environment: ${config.currentEnvironment}`);
  console.log(`📍 Local: http://${serverConfig.host}:${serverConfig.port}`);
  console.log(`💚 Health: http://${serverConfig.host}:${serverConfig.port}/health`);
  console.log(`🔐 Auth: http://${serverConfig.host}:${serverConfig.port}/api/auth`);
  console.log(`👥 Users: http://${serverConfig.host}:${serverConfig.port}/api/users`);
  console.log(`👤 Profiles: http://${serverConfig.host}:${serverConfig.port}/api/profiles`);
  console.log(`🌆 Events: http://${serverConfig.host}:${serverConfig.port}/api/events`);
  console.log(`🛍️  Services: http://${serverConfig.host}:${serverConfig.port}/api/services`);
  console.log(`📸 Service Media: http://${serverConfig.host}:${serverConfig.port}/api/services-media`);
  console.log(`🔍 Swagger: http://${serverConfig.host}:${serverConfig.port}/api/docs`);
  console.log(`️ Database: MongoDB (${config.currentEnvironment})`);
});

module.exports = app;
