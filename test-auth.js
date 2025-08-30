const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'TestPass123!',
  role: 'user'
};

const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@wedwisely.com',
  password: 'AdminPass123!',
  role: 'admin'
};

async function testAuthSystem() {
  try {
    console.log('🧪 Testing Authentication System...\n');

    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.data.user._id);
      console.log('   Role:', registerResponse.data.data.user.role);
      console.log('   Tokens received:', !!registerResponse.data.data.tokens);
      console.log('');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  User already exists, continuing with login...\n');
      } else {
        console.log('❌ Registration failed:', error.response?.data?.error || error.message);
        console.log('');
      }
    }

    // Test 2: User Login
    console.log('2️⃣ Testing User Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.data.message);
      console.log('   User:', loginResponse.data.data.user.email);
      console.log('   Role:', loginResponse.data.data.user.role);
      
      const { accessToken, refreshToken } = loginResponse.data.data.tokens;
      console.log('   Access token received:', !!accessToken);
      console.log('   Refresh token received:', !!refreshToken);
      console.log('');

      // Test 3: Get Current User Profile (Protected Route)
      console.log('3️⃣ Testing Protected Route - Get Current User...');
      try {
        const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        console.log('✅ Profile retrieval successful');
        console.log('   User:', profileResponse.data.data.email);
        console.log('   Full Name:', profileResponse.data.data.fullName);
        console.log('');
      } catch (error) {
        console.log('❌ Profile retrieval failed:', error.response?.data?.error || error.message);
        console.log('');
      }

      // Test 4: Refresh Token
      console.log('4️⃣ Testing Token Refresh...');
      try {
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken
        });
        console.log('✅ Token refresh successful');
        console.log('   New access token received:', !!refreshResponse.data.data.tokens.accessToken);
        console.log('   New refresh token received:', !!refreshResponse.data.data.tokens.refreshToken);
        console.log('');
      } catch (error) {
        console.log('❌ Token refresh failed:', error.response?.data?.error || error.message);
        console.log('');
      }

    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.error || error.message);
      console.log('');
    }

    // Test 5: Admin User Creation (if needed)
    console.log('5️⃣ Testing Admin User Creation...');
    try {
      const adminRegisterResponse = await axios.post(`${BASE_URL}/auth/register`, adminUser);
      console.log('✅ Admin registration successful:', adminRegisterResponse.data.message);
      console.log('   Admin ID:', adminRegisterResponse.data.data.user._id);
      console.log('   Role:', adminRegisterResponse.data.data.user.role);
      console.log('');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  Admin user already exists');
        console.log('');
      } else {
        console.log('❌ Admin registration failed:', error.response?.data?.error || error.message);
        console.log('');
      }
    }

    console.log('🎉 Authentication System Test Complete!');
    console.log('\n📋 Available Endpoints:');
    console.log('   POST /api/auth/register - User registration');
    console.log('   POST /api/auth/login - User login');
    console.log('   POST /api/auth/refresh-token - Refresh JWT token');
    console.log('   GET  /api/auth/me - Get current user profile (protected)');
    console.log('   PUT  /api/auth/profile - Update profile (protected)');
    console.log('   PUT  /api/auth/change-password - Change password (protected)');
    console.log('   POST /api/auth/logout - Logout (protected)');
    console.log('   GET  /api/users/all - Get all users (admin only)');
    console.log('   GET  /api/users/stats - Get user statistics (admin only)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAuthSystem();
}

module.exports = { testAuthSystem };
