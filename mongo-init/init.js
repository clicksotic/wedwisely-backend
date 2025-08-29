// Initialize database with single collection
db = db.getSiblingDB('wedwisely-db');

// Create only one collection
db.createCollection('users');

print('✅ Database initialized with single collection');
print('�� Collection created: users');
print('💡 Ready for your data');