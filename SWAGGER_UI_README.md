# Swagger UI Setup for WedWisely Backend

This document explains how to access and use the Swagger UI for the WedWisely Backend API, specifically for the User System and Profile System.

## Overview

The WedWisely Backend API now includes comprehensive Swagger documentation for:
- **Authentication System** - User registration, login, profile management
- **User Management** - Admin functions for user administration
- **Profile Management** - User profile creation, updates, and location-based search

## Accessing Swagger UI

### Local Development
1. Start the development server:
   ```bash
   npm run dev
   # or
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api/docs
   ```

### Production
Replace `localhost:3000` with your production domain:
```
https://your-domain.com/api/docs
```

## API Documentation Structure

### 1. Authentication System (`/auth/*`)

#### Public Endpoints (No Authentication Required)
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - User login
- **POST** `/auth/refresh-token` - Refresh access token

#### Protected Endpoints (Authentication Required)
- **POST** `/auth/create-admin` - Create admin user (admin only)
- **GET** `/auth/me` - Get current user profile
- **PUT** `/auth/profile` - Update user profile
- **PUT** `/auth/change-password` - Change user password
- **POST** `/auth/logout` - User logout

### 2. User Management System (`/users/*`)

#### Admin-Only Endpoints
- **GET** `/users/all` - Get all users with pagination and filtering
- **GET** `/users/stats` - Get user statistics
- **DELETE** `/users/{id}` - Delete/deactivate user

#### User/Admin Endpoints
- **GET** `/users/{id}` - Get user by ID (admin or self)
- **PUT** `/users/{id}` - Update user by ID (admin or self)

### 3. Profile Management System (`/profiles/*`)

#### Public Endpoints
- **GET** `/profiles/nearby/search` - Find profiles near a location

#### Protected Endpoints
- **POST** `/profiles/create` - Create user profile
- **GET** `/profiles/me` - Get current user's profile
- **PUT** `/profiles/update` - Update current user's profile
- **DELETE** `/profiles/delete` - Delete current user's profile

## Authentication in Swagger UI

### Getting Started

#### 🚀 **Automatic Token Extraction (Recommended)**
1. **Register a new user** using `/auth/register` OR **Login** using `/auth/login`
2. **The token will be automatically extracted and set!** 🎉
3. You'll see a green notification confirming the token was set
4. All protected endpoints will now work automatically

#### 🔧 **Manual Token Setup (Alternative)**
If automatic extraction doesn't work:
1. **Login** using `/auth/login` to get your access token
2. **Look for the "🔑 Auto-set Token" button** in the response section
3. **Click the button** to automatically set the token
4. **OR manually authorize**:
   - Click the "Authorize" button (🔒) at the top of the Swagger UI
   - In the "Value" field, enter **ONLY** your JWT token (without "Bearer" prefix)
   - Example: If your token is `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`, enter just that
   - Click "Authorize"

### Token Management
- **Automatic**: Tokens are automatically extracted from login/register responses
- **Manual**: Enter only the JWT token, not "Bearer YOUR_TOKEN"
- Access tokens are automatically persisted across browser sessions
- Use the refresh token endpoint to get new access tokens when they expire
- Tokens are required for all protected endpoints
- The "Authorize" button will show a green checkmark when a token is active
- You'll see a success notification when tokens are automatically set

## Data Models

### User Model
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "isActive": true,
  "isEmailVerified": false,
  "lastLogin": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "fullName": "John Doe"
}
```

### Profile Model
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "age": 34,
  "phone": "+1234567890",
  "location": {
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "United States",
    "coordinates": {
      "type": "Point",
      "coordinates": [-74.006, 40.7128]
    }
  },
  "pinCode": "10001",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "calculatedAge": 34
}
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Query Parameters

### User List Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `role` - Filter by user role (user, vendor, admin)
- `search` - Search by name or email
- `sortBy` - Sort field (createdAt, firstName, lastName, email)
- `sortOrder` - Sort direction (asc, desc)

### Profile Location Search
- `lat` - Latitude coordinate (required)
- `lng` - Longitude coordinate (required)
- `distance` - Search radius in kilometers (default: 10)

## Testing with Swagger UI

### Step-by-Step Testing Guide

#### 🚀 **With Automatic Token Extraction (Easiest)**

1. **Register a User**
   - Use `/auth/register` endpoint
   - Fill in required fields: firstName, lastName, email, password
   - **The token will be automatically extracted and set!** 🎉
   - You'll see a green notification confirming this

2. **Test Protected Endpoints Immediately**
   - Try `/auth/me` to get current user (should work automatically)
   - Try `/profiles/create` to create a profile
   - Try `/profiles/me` to get current profile
   - Try `/users/all` (if you're an admin)

#### 🔧 **With Manual Token Button (If Auto Doesn't Work)**

1. **Login**
   - Use `/auth/login` endpoint
   - Fill in email and password
   - Look for the **"🔑 Auto-set Token"** button in the response section
   - Click the button to set the token automatically

#### 🔧 **Manual Testing (If Needed)**

1. **Register a User**
   - Use `/auth/register` endpoint
   - Fill in required fields: firstName, lastName, email, password
   - Copy the returned token from the response

2. **Authorize in Swagger**
   - Click "Authorize" button
   - Enter: `YOUR_TOKEN_HERE` (without "Bearer" prefix)
   - Click "Authorize"

3. **Test Protected Endpoints**
   - Try `/auth/me` to get current user
   - Try `/profiles/create` to create a profile
   - Try `/profiles/me` to get current profile
   - Try `/users/all` (if you're an admin)

5. **Test Location Search**
   - Use `/profiles/nearby/search` with lat/lng coordinates
   - Adjust distance parameter as needed

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Development Notes

### Swagger Configuration
- Swagger spec is generated from JSDoc comments in route files
- Configuration is in `config/swagger.js`
- API paths are automatically discovered from route files

### Adding New Endpoints
To add Swagger documentation for new endpoints:
1. Add JSDoc comments above the route definition
2. Include `@swagger` tags for the endpoint
3. Define request/response schemas in the `components/schemas` section
4. The endpoint will automatically appear in Swagger UI

### Schema Definitions
- All schemas are defined in the route files using `@swagger` comments
- Schemas are reusable across different endpoints
- Validation rules match the Mongoose model definitions

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Make sure you're logged in and have a valid token
   - **Important**: Enter only the JWT token (without "Bearer" prefix) in the Authorize dialog
   - Check that the token hasn't expired
   - Try logging in again to get a fresh token

2. **Token not persisting**
   - Make sure you clicked "Authorize" after entering the token
   - Check that the "Authorize" button shows a green checkmark
   - Try refreshing the page and re-entering the token
   - Clear browser cache and cookies if issues persist

3. **"Forbidden" errors**
   - Check if your user role has permission for the endpoint
   - Admin-only endpoints require `role: "admin"`
   - Make sure you're using the correct user account

4. **Validation errors**
   - Check the required fields in the request body
   - Ensure data types match the schema definitions
   - Check field length limits and format requirements

5. **Swagger UI not loading**
   - Ensure the server is running
   - Check the correct URL: `http://localhost:3000/api/docs`
   - Verify Swagger configuration in `config/swagger.js`

6. **Token format issues**
   - **Correct**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Incorrect**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - The "Bearer" prefix is automatically added by Swagger UI

## Additional Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc Documentation](https://jsdoc.app/)

## Support

For issues with the API or Swagger documentation, please check:
1. Server logs for error details
2. Network tab in browser developer tools
3. API response messages for specific error information
