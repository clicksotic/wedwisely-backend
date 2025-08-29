const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('./config');
const database = require('./config/database');

const app = express();
const serverConfig = config.getServerConfig();
const corsConfig = config.getCorsConfig();
const loggingConfig = config.getLoggingConfig();
const featuresConfig = config.getFeaturesConfig();

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
    message: 'Welcome to Node.js REST API',
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

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'API is working',
    version: '1.0.0',
    environment: config.currentEnvironment,
    database: database.getStatus(),
    endpoints: ['/', '/health', '/api', '/api/environment', '/api/db/status']
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

// Error handling middleware
app.use((err, req, res, next) => {
  if (loggingConfig.enableErrorLogging) {
    console.error('Error:', err);
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end',
    environment: config.currentEnvironment,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(serverConfig.port, serverConfig.host, () => {
  console.log(`🚀 Server running on ${serverConfig.host}:${serverConfig.port}`);
  console.log(`🌍 Environment: ${config.currentEnvironment}`);
  console.log(`📍 Local: http://${serverConfig.host}:${serverConfig.port}`);
  console.log(`💚 Health: http://${serverConfig.host}:${serverConfig.port}/health`);
  console.log(`️ Database: MongoDB (${config.currentEnvironment})`);
});

module.exports = app;