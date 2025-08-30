require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./src/auth/models/User'); // adjust path if needed
const AuthService = require('./src/auth/services/authService');


async function seedAdmin() {
  try {
    // ✅ pick DB URI based on NODE_ENV
    let dbUri;
    if (process.env.NODE_ENV === 'production') {
      dbUri = process.env.MONGODB_PROD_URI;
    } else if (process.env.NODE_ENV === 'development') {
      dbUri = process.env.MONGODB_DEV_URI;
    } else {
      dbUri = process.env.MONGODB_LOCAL_URI; // default local
    }

    if (!dbUri) {
      throw new Error("❌ No MongoDB URI found in environment variables");
    }

    // connect to db
    await mongoose.connect(dbUri, {
    });

    console.log("🌱 Checking for existing admin...");

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists, skipping seeding.");
      process.exit(0);
    }

    // hash password
    //const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // create admin user
    await AuthService.register({
      firstName: "Super",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });



    console.log(`✅ Admin user created!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
}

seedAdmin();
