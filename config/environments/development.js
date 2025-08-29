module.exports = {
    name: 'development',
    database: {
      uri: process.env.MONGODB_DEV_URI,
      options: {
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        w: 'majority'
      }
    },
    server: {
      host: process.env.DEV_HOST || '0.0.0.0',
      port: process.env.DEV_PORT || 3000
    },
    cors: {
      origin: [
        // Web App Origins
        process.env.CORS_ORIGIN_DEV_WEB || 'https://your-dev-web.com',
        'http://localhost:3000',
        'http://localhost:3001',
        // Mobile App Origins (for webview testing)
        'capacitor://localhost',
        'ionic://localhost',
        // Development Tools
        'http://localhost:8080',
        'http://localhost:4200'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count']
    },
    logging: {
      level: 'info',
      enableRequestLogging: true,
      enableErrorLogging: true
    },
    features: {
      enableRateLimit: true,
      enableCompression: true,
      enableHelmet: true
    }
  };