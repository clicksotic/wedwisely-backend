module.exports = {
    name: 'production',
    database: {
      uri: process.env.MONGODB_PROD_URI,
      options: {
        maxPoolSize: 20,
        minPoolSize: 10,
        retryWrites: true,
        w: 'majority',
        ssl: true,
        sslValidate: true
      }
    },
    server: {
      host: process.env.PROD_HOST || '0.0.0.0',
      port: process.env.PROD_PORT || 3000
    },
    cors: {
      origin: [
        // Production Web App
        process.env.CORS_ORIGIN_PROD_WEB || 'https://your-production-web.com',
        // Production Mobile App (if using webview)
        process.env.CORS_ORIGIN_PROD_MOBILE || 'https://your-mobile-app.com',
        // CDN Origins
        process.env.CORS_ORIGIN_CDN || 'https://cdn.yourdomain.com'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count']
    },
    logging: {
      level: 'warn',
      enableRequestLogging: false,
      enableErrorLogging: true
    },
    features: {
      enableRateLimit: true,
      enableCompression: true,
      enableHelmet: true
    }
  };