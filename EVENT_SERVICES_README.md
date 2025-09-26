# Event-Service Linking System

This document describes the event-service linking functionality that allows users to link services to their events and manage those relationships.

## Overview

The event-service linking system provides a way to:
- Link services to events
- Track service status (pending, confirmed, cancelled)
- Add notes to service-event relationships
- Get statistics about services linked to events
- Manage service-event relationships with proper authorization

## Database Schema

### EventService Model

```javascript
{
  event: ObjectId (ref: Event) - Required
  service: ObjectId (ref: Service) - Required
  addedBy: ObjectId (ref: User) - Required
  status: String (enum: ['pending', 'confirmed', 'cancelled']) - Default: 'pending'
  notes: String (max 500 chars) - Optional
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### 1. Add Service to Event
**POST** `/api/events/:eventId/services/:serviceId`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can add services to their events
- **Description**: Links a service to an event
- **Response**: EventService object with populated references

### 2. Get Services by Event
**GET** `/api/events/:eventId/services`

- **Authentication**: Required (Bearer token)
- **Authorization**: Event owner or admin can access
- **Description**: Retrieves all services linked to an event
- **Response**: Array of EventService objects with populated service, event, and user data

### 3. Remove Service from Event
**DELETE** `/api/events/:eventId/services/:serviceId`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can remove services from their events
- **Description**: Removes a service from an event
- **Response**: Confirmation message with removed service data

### 4. Update Service Status
**PUT** `/api/events/:eventId/services/:serviceId/status`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can update service status
- **Description**: Updates the status of a service-event relationship
- **Request Body**:
  ```json
  {
    "status": "confirmed" // "pending", "confirmed", or "cancelled"
  }
  ```

### 5. Add Service Notes
**PUT** `/api/events/:eventId/services/:serviceId/notes`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can add notes
- **Description**: Adds or updates notes for a service-event relationship
- **Request Body**:
  ```json
  {
    "notes": "Special requirements for this service"
  }
  ```

### 6. Get Event Service Statistics
**GET** `/api/events/:eventId/services/stats`

- **Authentication**: Required (Bearer token)
- **Authorization**: Event owner or admin can access
- **Description**: Retrieves statistics about services linked to an event
- **Response**:
  ```json
  {
    "totalServices": 5,
    "statusBreakdown": [
      { "_id": "confirmed", "count": 3 },
      { "_id": "pending", "count": 2 }
    ]
  }
  ```

### 7. Get Events by Service (Admin Only)
**GET** `/api/events/admin/services/:serviceId/events`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only admins can access
- **Description**: Retrieves all events that have a specific service linked
- **Response**: Array of EventService objects with populated event data

## Authorization Rules

1. **Event Creation**: Only users with role 'user' can create events
2. **Service Addition**: Only users with role 'user' can add services to their own events
3. **Service Management**: Only event owners can update/remove services from their events
4. **Admin Access**: Admins can view all event-service relationships and statistics
5. **Service Creation**: Only users with role 'vendor' can create services

## Business Logic

### Service-Event Linking
- Each service can only be linked to an event once (unique constraint)
- Only the event owner can manage service-event relationships
- Services must exist and be active to be linked to events
- Events must exist and belong to the requesting user

### Status Management
- Default status is 'pending' when a service is first linked
- Status can be updated to 'confirmed' or 'cancelled'
- Status changes are tracked with timestamps

### Notes Management
- Notes are optional and can be up to 500 characters
- Notes can be updated at any time by the event owner
- Notes provide context for the service-event relationship

## Error Handling

The system handles various error scenarios:
- Event not found or not owned by user
- Service not found
- Service already linked to event
- Invalid status values
- Unauthorized access attempts
- Validation errors

## Testing

A comprehensive test suite is available in `test-event-services.js` that covers:
- User registration and authentication
- Event creation
- Service creation
- Service-event linking
- Status updates
- Notes management
- Statistics retrieval
- Admin functionality
- Error scenarios

To run the tests:
```bash
node test-event-services.js
```

## Usage Examples

### Adding a Service to an Event
```javascript
const response = await axios.post('/api/events/EVENT_ID/services/SERVICE_ID', {}, {
  headers: { 'Authorization': `Bearer ${userToken}` }
});
```

### Getting Services for an Event
```javascript
const response = await axios.get('/api/events/EVENT_ID/services', {
  headers: { 'Authorization': `Bearer ${userToken}` }
});
```

### Updating Service Status
```javascript
const response = await axios.put('/api/events/EVENT_ID/services/SERVICE_ID/status', {
  status: 'confirmed'
}, {
  headers: { 'Authorization': `Bearer ${userToken}` }
});
```

## Integration with Existing Systems

The event-service linking system integrates seamlessly with:
- **Event Management**: Extends existing event functionality
- **Service Management**: Uses existing service models and data
- **User Management**: Leverages existing authentication and authorization
- **Profile Management**: Works with existing user profiles

## Future Enhancements

Potential future enhancements could include:
- Bulk service operations
- Service recommendations based on event details
- Automated status updates based on event timeline
- Integration with payment systems
- Service rating and review system
- Calendar integration for service scheduling
