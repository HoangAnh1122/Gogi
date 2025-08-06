// Test script để kiểm tra User CRUD operations
// Chạy: node test-user-crud.js

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let adminToken = '';

// Test login và lấy admin token
async function testLogin() {
  try {
    console.log('🔍 Testing login...');
    const response = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.data.token) {
      adminToken = response.data.data.token;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
}

// Test lấy danh sách users
async function testGetUsers() {
  try {
    console.log('\n🔍 Testing get users...');
    const response = await axios.get(`${API_BASE}/auth/users?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ Get users successful');
      console.log(`📊 Found ${response.data.data.total} users`);
      return response.data.data.data; // Return users array
    } else {
      console.log('❌ Get users failed:', response.data);
      return [];
    }
  } catch (error) {
    console.log('❌ Get users error:', error.message);
    return [];
  }
}

// Test tạo user mới
async function testCreateUser() {
  try {
    console.log('\n🔍 Testing create user...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'test123456',
      role: 'user'
    };
    
    const response = await axios.post(`${API_BASE}/auth/users`, testUser, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ Create user successful');
      console.log(`👤 Created user: ${response.data.data.username}`);
      return response.data.data;
    } else {
      console.log('❌ Create user failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Create user error:', error.response?.data?.error || error.message);
    return null;
  }
}

// Test update user
async function testUpdateUser(userId) {
  try {
    console.log('\n🔍 Testing update user...');
    const updateData = {
      email: `updated_${Date.now()}@example.com`,
      role: 'admin'
    };
    
    const response = await axios.put(`${API_BASE}/auth/users/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ Update user successful');
      console.log(`📝 Updated user email: ${response.data.data.email}`);
      return true;
    } else {
      console.log('❌ Update user failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Update user error:', error.response?.data?.error || error.message);
    return false;
  }
}

// Test delete user
async function testDeleteUser(userId) {
  try {
    console.log('\n🔍 Testing delete user...');
    const response = await axios.delete(`${API_BASE}/auth/users/${userId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ Delete user successful');
      return true;
    } else {
      console.log('❌ Delete user failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Delete user error:', error.response?.data?.error || error.message);
    return false;
  }
}

// Chạy tất cả tests
async function runAllTests() {
  console.log('🚀 Starting User CRUD Tests...\n');
  
  // Test 1: Login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('\n❌ Cannot continue without login. Please check backend server and default admin account.');
    return;
  }
  
  // Test 2: Get Users
  const users = await testGetUsers();
  
  // Test 3: Create User
  const newUser = await testCreateUser();
  if (!newUser) {
    console.log('\n❌ Create user failed, skipping remaining tests');
    return;
  }
  
  // Test 4: Update User
  await testUpdateUser(newUser.id);
  
  // Test 5: Delete User
  await testDeleteUser(newUser.id);
  
  // Test 6: Verify deletion
  console.log('\n🔍 Verifying deletion...');
  await testGetUsers();
  
  console.log('\n🎉 All tests completed!');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.log('❌ Unhandled error:', error.message);
  process.exit(1);
});

// Start tests
runAllTests().catch(console.error);
