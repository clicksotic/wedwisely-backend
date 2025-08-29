const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WedWisely Wedding Planning Backend API',
    company: 'WedWisely',
    status: 'Server is running successfully',
    version: '1.0.0',
    endpoints: {
      root: '/',
      health: '/health',
      api: '/api/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    company: 'WedWisely',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// API Routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'WedWisely API Endpoints',
    version: '1.0.0',
    availableEndpoints: [
      'GET /api/weddings',
      'POST /api/weddings',
      'GET /api/weddings/:id',
      'PUT /api/weddings/:id',
      'DELETE /api/weddings/:id'
    ],
    timestamp: new Date().toISOString()
  });
});

// Wedding routes placeholder
app.get('/api/weddings', (req, res) => {
  res.json({
    message: 'Wedding list endpoint',
    data: [],
    count: 0,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/weddings', (req, res) => {
  res.status(201).json({
    message: 'Wedding created successfully',
    data: req.body,
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/', '/health', '/api'],
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 WedWisely Backend Server is running!');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Company: WedWisely`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`📱 API Base: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;