module.exports = {
    name: 'local',
    database: {
      uri: process.env.MONGODB_LOCAL_URI || 'mongodb://admin:wedding123@localhost:27017/wedwisely-db?authSource=admin',
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
      origin: [
        // Local Development
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8080',
        'http://localhost:4200',
        // Mobile App Development
        'capacitor://localhost',
        'ionic://localhost',
        'http://192.168.1.100:3000', // Local network for mobile testing
        'http://192.168.1.100:8080'
      ],
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