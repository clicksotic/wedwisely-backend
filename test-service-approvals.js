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

const vendorUser = {
  firstName: 'Vendor',
  lastName: 'Smith',
  email: 'vendor@wedwisely.com',
  password: 'VendorPass123!',
  role: 'vendor'
};

let userToken = '';
let adminToken = '';
let vendorToken = '';
let eventId = '';
let serviceId = '';
let approvalId = '';

async function testServiceApprovalSystem() {
  try {
    console.log('🧪 Testing Service Approval System...\n');

    // Step 1: Register and login users
    await registerAndLoginUsers();

    // Step 2: Create an event
    await createEvent();

    // Step 3: Create a service
    await createService();

    // Step 4: Request service approval
    await requestServiceApproval();

    // Step 5: Test vendor viewing approval requests
    await getApprovalRequestsForVendor();

    // Step 6: Test user viewing their requests
    await getApprovalRequestsByUser();

    // Step 7: Test approving the request
    await approveServiceRequest();

    // Step 8: Test getting approval statistics
    await getApprovalStats();

    // Step 9: Test admin functionality
    await testAdminFunctionality();

    // Step 10: Test rejection flow (create new request)
    await testRejectionFlow();

    console.log('🎉 Service Approval System Test Complete!');
    console.log('\n📋 Available Endpoints:');
    console.log('   POST   /api/services/approvals/request/:eventId/:serviceId - Request service approval');
    console.log('   GET    /api/services/approvals/my-requests - Get user requests');
    console.log('   GET    /api/services/approvals/service-owner - Get vendor requests');
    console.log('   GET    /api/services/approvals/:approvalId - Get single request');
    console.log('   PUT    /api/services/approvals/:approvalId/approve - Approve request');
    console.log('   PUT    /api/services/approvals/:approvalId/reject - Reject request');
    console.log('   DELETE /api/services/approvals/:approvalId/cancel - Cancel request');
    console.log('   GET    /api/services/approvals/stats/my-requests - User stats');
    console.log('   GET    /api/services/approvals/stats/service-owner - Vendor stats');
    console.log('   GET    /api/services/approvals/admin/all - Admin view all');
    console.log('   POST   /api/services/approvals/admin/cleanup - Cleanup expired');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function registerAndLoginUsers() {
  console.log('1️⃣ Registering and logging in users...');
  
  // Register user
  try {
    await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered');
  } catch (error) {
    if (error.response?.status !== 409) {
      console.log('❌ User registration failed:', error.response?.data?.error);
      return;
    }
  }

  // Register admin
  try {
    await axios.post(`${BASE_URL}/auth/register`, adminUser);
    console.log('✅ Admin registered');
  } catch (error) {
    if (error.response?.status !== 409) {
      console.log('❌ Admin registration failed:', error.response?.data?.error);
      return;
    }
  }

  // Register vendor
  try {
    await axios.post(`${BASE_URL}/auth/register`, vendorUser);
    console.log('✅ Vendor registered');
  } catch (error) {
    if (error.response?.status !== 409) {
      console.log('❌ Vendor registration failed:', error.response?.data?.error);
      return;
    }
  }

  // Login user
  try {
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    userToken = userLogin.data.data.tokens.accessToken;
    console.log('✅ User logged in');
  } catch (error) {
    console.log('❌ User login failed:', error.response?.data?.error);
    return;
  }

  // Login admin
  try {
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminLogin.data.data.tokens.accessToken;
    console.log('✅ Admin logged in');
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.error);
    return;
  }

  // Login vendor
  try {
    const vendorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: vendorUser.email,
      password: vendorUser.password
    });
    vendorToken = vendorLogin.data.data.tokens.accessToken;
    console.log('✅ Vendor logged in');
  } catch (error) {
    console.log('❌ Vendor login failed:', error.response?.data?.error);
    return;
  }

  console.log('');
}

async function createEvent() {
  console.log('2️⃣ Creating an event...');
  try {
    const eventResponse = await axios.post(`${BASE_URL}/events/create`, {
      date: '2025-12-25',
      location: {
        city: 'New York',
        country: 'USA'
      }
    }, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    eventId = eventResponse.data._id;
    console.log('✅ Event created:', eventResponse.data._id);
    console.log('   Date:', eventResponse.data.date);
    console.log('   Location:', eventResponse.data.location.city, eventResponse.data.location.country);
    console.log('');
  } catch (error) {
    console.log('❌ Event creation failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function createService() {
  console.log('3️⃣ Creating a service...');
  try {
    const serviceResponse = await axios.post(`${BASE_URL}/services`, {
      name: 'Wedding Photography',
      description: 'Professional wedding photography services',
      category: 'Photography',
      location: {
        city: 'New York',
        country: 'USA'
      },
      price: 2500
    }, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    
    serviceId = serviceResponse.data._id;
    console.log('✅ Service created:', serviceResponse.data._id);
    console.log('   Name:', serviceResponse.data.name);
    console.log('   Category:', serviceResponse.data.category);
    console.log('   Price:', serviceResponse.data.price);
    console.log('');
  } catch (error) {
    console.log('❌ Service creation failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function requestServiceApproval() {
  console.log('4️⃣ Requesting service approval...');
  try {
    const response = await axios.post(`${BASE_URL}/services/approvals/request/${eventId}/${serviceId}`, {}, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    approvalId = response.data.data._id;
    console.log('✅ Service approval requested successfully');
    console.log('   Approval ID:', response.data.data._id);
    console.log('   Status:', response.data.data.status);
    console.log('   Expires at:', response.data.data.expiresAt);
    console.log('');
  } catch (error) {
    console.log('❌ Service approval request failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function getApprovalRequestsForVendor() {
  console.log('5️⃣ Getting approval requests for vendor...');
  try {
    const response = await axios.get(`${BASE_URL}/services/approvals/service-owner`, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    
    console.log('✅ Vendor approval requests retrieved successfully');
    console.log('   Number of requests:', response.data.data.length);
    if (response.data.data.length > 0) {
      const request = response.data.data[0];
      console.log('   Event date:', request.event.date);
      console.log('   Service name:', request.service.name);
      console.log('   Requested by:', request.requestedBy.firstName, request.requestedBy.lastName);
      console.log('   Status:', request.status);
    }
    console.log('');
  } catch (error) {
    console.log('❌ Getting vendor approval requests failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function getApprovalRequestsByUser() {
  console.log('6️⃣ Getting approval requests by user...');
  try {
    const response = await axios.get(`${BASE_URL}/services/approvals/my-requests`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    console.log('✅ User approval requests retrieved successfully');
    console.log('   Number of requests:', response.data.data.length);
    if (response.data.data.length > 0) {
      const request = response.data.data[0];
      console.log('   Event date:', request.event.date);
      console.log('   Service name:', request.service.name);
      console.log('   Service owner:', request.serviceOwner.firstName, request.serviceOwner.lastName);
      console.log('   Status:', request.status);
    }
    console.log('');
  } catch (error) {
    console.log('❌ Getting user approval requests failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function approveServiceRequest() {
  console.log('7️⃣ Approving service request...');
  try {
    const response = await axios.put(`${BASE_URL}/services/approvals/${approvalId}/approve`, {
      message: 'Approved with special conditions'
    }, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    
    console.log('✅ Service request approved successfully');
    console.log('   New status:', response.data.data.status);
    console.log('   Approved at:', response.data.data.approvedAt);
    console.log('   Message:', response.data.data.message);
    console.log('');
  } catch (error) {
    console.log('❌ Approving service request failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function getApprovalStats() {
  console.log('8️⃣ Getting approval statistics...');
  
  // User stats
  try {
    const userStats = await axios.get(`${BASE_URL}/services/approvals/stats/my-requests`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    console.log('✅ User approval stats retrieved');
    console.log('   Total requests:', userStats.data.data.totalRequests);
    console.log('   Pending requests:', userStats.data.data.pendingRequests);
    console.log('   Status breakdown:', userStats.data.data.statusBreakdown);
  } catch (error) {
    console.log('❌ Getting user stats failed:', error.response?.data?.error || error.message);
  }

  // Vendor stats
  try {
    const vendorStats = await axios.get(`${BASE_URL}/services/approvals/stats/service-owner`, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    
    console.log('✅ Vendor approval stats retrieved');
    console.log('   Total requests:', vendorStats.data.data.totalRequests);
    console.log('   Pending requests:', vendorStats.data.data.pendingRequests);
    console.log('   Status breakdown:', vendorStats.data.data.statusBreakdown);
  } catch (error) {
    console.log('❌ Getting vendor stats failed:', error.response?.data?.error || error.message);
  }

  console.log('');
}

async function testAdminFunctionality() {
  console.log('9️⃣ Testing admin functionality...');
  try {
    const response = await axios.get(`${BASE_URL}/services/approvals/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log('✅ Admin functionality working');
    console.log('   Total approval requests:', response.data.data.length);
    if (response.data.data.length > 0) {
      const request = response.data.data[0];
      console.log('   Event date:', request.event.date);
      console.log('   Service name:', request.service.name);
      console.log('   Status:', request.status);
    }
    console.log('');
  } catch (error) {
    console.log('❌ Admin functionality failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

async function testRejectionFlow() {
  console.log('🔟 Testing rejection flow...');
  
  // Create another service for testing rejection
  try {
    const serviceResponse = await axios.post(`${BASE_URL}/services`, {
      name: 'Wedding Catering',
      description: 'Professional wedding catering services',
      category: 'Catering',
      location: {
        city: 'New York',
        country: 'USA'
      },
      price: 5000
    }, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    
    const newServiceId = serviceResponse.data._id;
    console.log('✅ New service created for rejection test:', newServiceId);
    
    // Request approval for the new service
    const approvalResponse = await axios.post(`${BASE_URL}/services/approvals/request/${eventId}/${newServiceId}`, {}, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    const newApprovalId = approvalResponse.data.data._id;
    console.log('✅ New approval request created:', newApprovalId);
    
    // Reject the request
    const rejectResponse = await axios.put(`${BASE_URL}/services/approvals/${newApprovalId}/reject`, {
      rejectionReason: 'Not available on the requested date'
    }, {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    });
    
    console.log('✅ Service request rejected successfully');
    console.log('   Rejection reason:', rejectResponse.data.data.rejectionReason);
    console.log('   Rejected at:', rejectResponse.data.data.rejectedAt);
    console.log('');
  } catch (error) {
    console.log('❌ Rejection flow test failed:', error.response?.data?.error || error.message);
    console.log('');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testServiceApprovalSystem();
}

module.exports = { testServiceApprovalSystem };
