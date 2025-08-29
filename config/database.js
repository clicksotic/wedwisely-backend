const mongoose = require('mongoose');
const config = require('./index');

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.environment = config.currentEnvironment;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('✅ MongoDB already connected');
        return this.connection;
      }

      const dbConfig = config.getDatabaseConfig();
      
      if (!dbConfig.uri) {
        throw new Error(`MongoDB URI not configured for environment: ${this.environment}`);
      }

      console.log(`🔌 Connecting to MongoDB (${this.environment})...`);
      console.log(`📍 URI: ${dbConfig.uri.replace(/\/\/.*@/, '//***:***@')}`);
      
      this.connection = await mongoose.connect(dbConfig.uri, dbConfig.options);
      this.isConnected = true;

      // Connection event handlers
      mongoose.connection.on('connected', () => {
        console.log(`✅ MongoDB connected successfully (${this.environment})`);
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      // Graceful shutdown
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));

      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection && this.isConnected) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log('✅ MongoDB disconnected successfully');
      }
    } catch (error) {
      console.error('❌ MongoDB disconnection error:', error.message);
    }
  }

  async gracefulShutdown() {
    console.log('🔄 Shutting down gracefully...');
    await this.disconnect();
    process.exit(0);
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      environment: this.environment,
      database: 'mongodb',
      uri: config.getDatabaseConfig().uri ? 'configured' : 'not configured'
    };
  }

  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected', message: 'Database not connected' };
      }
      
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', message: 'Database connection is healthy' };
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }
}

module.exports = new Database();