// Function to get local IP addresses
function getLocalIPs() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  
  return results;
}

// Generate dynamic CORS origins
function generateCorsOrigins() {
  const localIPs = getLocalIPs();
  const origins = [
    // Local Development
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:8080',
    'http://localhost:4200',
    // Mobile App Development
    'capacitor://localhost',
    'ionic://localhost',
    // Allow all local IPs automatically
    ...localIPs.map(ip => `http://${ip}:3000`),
    ...localIPs.map(ip => `http://${ip}:8080`),
    // Allow all origins for mobile testing (temporary)
    '*'
  ];
  
  console.log('🌐 CORS Origins:', origins);
  return origins;
}

module.exports = {
    name: 'local',
    database: {
      uri: process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/wedwisely-db',
      options: {
        maxPoolSize: 5,
        minPoolSize: 2
      }
    },
    server: {
      host: process.env.LOCAL_HOST || '0.0.0.0',
      port: process.env.LOCAL_PORT || 3000
    },
    cors: {
      origin: generateCorsOrigins(),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count']
    },
    logging: {
      level: 'debug',
      enableRequestLogging: true,
      enableErrorLogging: true
    },
    features: {
      enableRateLimit: false,
      enableCompression: false,
      enableHelmet: false
    }
  };