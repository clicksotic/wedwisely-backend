const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WedWisely Learning Platform',
    company: 'WedWisely',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    company: 'WedWisely',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 WedWisely Server is running!');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Company: WedWisely`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});

module.exports = app;