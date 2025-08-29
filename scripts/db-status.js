const database = require('../config/database');

async function checkStatus() {
  try {
    console.log('🔍 Checking database status...');
    
    const status = database.getStatus();
    console.log('🗄️ Database Status:', status);
    
    if (status.isConnected) {
      const health = await database.healthCheck();
      console.log('💚 Health Check:', health);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
    process.exit(1);
  }
}

checkStatus();