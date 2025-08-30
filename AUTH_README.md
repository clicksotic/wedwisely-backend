# 🔐 WedWisely Authentication System

A comprehensive JWT-based authentication system with role-based access control (RBAC) for the WedWisely backend API.

## 🏗️ Architecture Overview

The authentication system is organized into a modular structure:

```
src/
├── auth/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & authorization middleware
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   └── index.js         # Module exports
├── utils/               # Utility functions
└── validators/          # Input validation middleware
```

## 🚀 Features

### ✅ Core Authentication
- **User Registration** with email/password
- **User Login** with JWT token generation
- **Token Refresh** for extended sessions
- **Password Hashing** with bcrypt
- **Logout** (client-side token removal)

### ✅ Role-Based Access Control
- **Three User Roles**: `user`, `vendor`, `admin`
- **Permission-based Data Access**: Users can only access their own data
- **Admin Privileges**: Full access to all user data and management

### ✅ Security Features
- **JWT Tokens**: Access and refresh token system
- **Password Requirements**: Strong password validation
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Custom error responses
- **Rate Limiting**: Built-in protection against abuse

### ✅ User Management
- **Profile Management**: Update personal information
- **Password Changes**: Secure password updates
- **Admin Operations**: User listing, statistics, and management
- **Soft Delete**: User deactivation instead of hard deletion

## 📋 API Endpoints

### 🔓 Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token

### 🔒 Protected Endpoints
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### 👑 Admin Only Endpoints
- `GET /api/users/all` - Get all users with pagination
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Deactivate user

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken express-validator axios
```

### 2. Environment Variables
Create a `.env` file with the following variables:
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 3. Database Setup
Ensure MongoDB is running and accessible. The system will automatically create the necessary collections.

### 4. Start the Server
```bash
npm run dev
```

## 🧪 Testing the System

### Run the Test Script
```bash
node test-auth.js
```

This will test:
1. User registration
2. User login
3. Protected route access
4. Token refresh
5. Admin user creation

### Manual Testing with cURL

#### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "TestPass123!",
    "role": "user"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "TestPass123!"
  }'
```

#### Access protected route:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔑 JWT Token Structure

### Access Token
- **Expiration**: 7 days (configurable)
- **Payload**: User ID, email, role, and timestamps
- **Usage**: Required for all protected routes

### Refresh Token
- **Expiration**: 30 days (configurable)
- **Payload**: User ID and timestamps
- **Usage**: Generate new access tokens

## 🛡️ Security Considerations

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Token Security
- Tokens are signed with a secret key
- Access tokens have shorter expiration
- Refresh tokens can be revoked by changing password
- Tokens include issuer and audience claims

### Data Access Control
- Users can only access their own data
- Admins have access to all user data
- Role changes are restricted to admin users
- Soft delete prevents data loss

## 🔄 Future Enhancements

### Planned Features
- **Email Verification**: Send verification emails
- **Password Reset**: Forgot password functionality
- **Two-Factor Authentication**: 2FA support
- **Session Management**: Track active sessions
- **Audit Logging**: User action tracking
- **API Rate Limiting**: Per-user rate limiting

### Extensibility
- **Custom Roles**: Add new user roles
- **Permission System**: Granular permissions per role
- **OAuth Integration**: Social login support
- **Multi-tenancy**: Support for multiple organizations

## 📚 Usage Examples

### Creating a Protected Route
```javascript
const { authenticate, authorize } = require('./src/auth/middleware/authMiddleware');

// Route accessible to all authenticated users
router.get('/profile', authenticate, userController.getProfile);

// Route accessible only to admins
router.get('/admin/users', authenticate, authorize('admin'), adminController.getUsers);

// Route accessible to admins and vendors
router.get('/vendor/data', authenticate, authorize('admin', 'vendor'), vendorController.getData);
```

### Using the Auth Service
```javascript
const AuthService = require('./src/auth/services/authService');

// Register a new user
const result = await AuthService.register({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  password: 'SecurePass123!',
  role: 'vendor'
});

// Login user
const loginResult = await AuthService.login('jane@example.com', 'SecurePass123!');
```

## 🐛 Troubleshooting

### Common Issues

1. **JWT Secret Not Set**
   - Ensure `JWT_SECRET` is set in your `.env` file
   - Restart the server after setting environment variables

2. **Database Connection Issues**
   - Check MongoDB connection string
   - Ensure MongoDB service is running
   - Verify network connectivity

3. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided
   - Verify password meets requirements

4. **Token Expired**
   - Use refresh token to get new access token
   - Check token expiration settings
   - Verify system clock accuracy

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and stack traces.

## 📄 License

This authentication system is part of the WedWisely backend project.

## 🤝 Contributing

When adding new features:
1. Follow the existing code structure
2. Add proper validation
3. Include error handling
4. Update documentation
5. Add tests if applicable

---

**Note**: This is a production-ready authentication system. Remember to:
- Change the JWT secret in production
- Use HTTPS in production
- Implement proper logging
- Set up monitoring and alerting
- Regular security audits
