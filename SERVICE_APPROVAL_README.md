# Service Approval System

This document describes the service approval system that manages the process of linking services to events through an approval workflow.

## Overview

The service approval system provides a controlled way to link services to events:
- Users request to link services to their events
- Service owners (vendors) approve or reject these requests
- Only approved services are actually linked to events
- Comprehensive tracking and statistics for all parties

## Database Schema

### ServiceApproval Model

```javascript
{
  event: ObjectId (ref: Event) - Required
  service: ObjectId (ref: Service) - Required
  requestedBy: ObjectId (ref: User) - Required
  serviceOwner: ObjectId (ref: User) - Required
  status: String (enum: ['pending', 'approved', 'rejected']) - Default: 'pending'
  message: String (max 500 chars) - Optional
  rejectionReason: String (max 500 chars) - Optional
  approvedAt: Date - Set when approved
  rejectedAt: Date - Set when rejected
  expiresAt: Date - Auto-expires after 7 days
  createdAt: Date
  updatedAt: Date
}
```

## Workflow

1. **User Request**: User requests to link a service to their event
2. **Approval Pending**: Request goes to service owner for approval
3. **Service Owner Action**: Vendor can approve or reject the request
4. **Auto-Linking**: If approved, service is automatically linked to the event
5. **Expiration**: Requests expire after 7 days if not acted upon

## API Endpoints

### 1. Request Service Approval
**POST** `/api/services/approvals/request/:eventId/:serviceId`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can request approvals
- **Description**: Creates a new approval request to link a service to an event
- **Response**: ServiceApproval object with pending status

### 2. Get User's Approval Requests
**GET** `/api/services/approvals/my-requests`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can view their requests
- **Query Parameters**:
  - `status` (optional): Filter by status (pending, approved, rejected)
- **Description**: Retrieves all approval requests made by the current user

### 3. Get Service Owner's Approval Requests
**GET** `/api/services/approvals/service-owner`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only vendors (role: 'vendor') can view service requests
- **Query Parameters**:
  - `status` (optional): Filter by status (pending, approved, rejected)
- **Description**: Retrieves all approval requests for services owned by the current vendor

### 4. Get Single Approval Request
**GET** `/api/services/approvals/:approvalId`

- **Authentication**: Required (Bearer token)
- **Authorization**: Requester, service owner, or admin can view
- **Description**: Retrieves a single approval request with full details

### 5. Approve Service Request
**PUT** `/api/services/approvals/:approvalId/approve`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only vendors (role: 'vendor') can approve requests for their services
- **Request Body**:
  ```json
  {
    "message": "Approved with special conditions" // Optional
  }
  ```
- **Description**: Approves a service request and automatically creates the EventService link

### 6. Reject Service Request
**PUT** `/api/services/approvals/:approvalId/reject`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only vendors (role: 'vendor') can reject requests for their services
- **Request Body**:
  ```json
  {
    "rejectionReason": "Not available on requested date" // Required
  }
  ```
- **Description**: Rejects a service request with a reason

### 7. Cancel Approval Request
**DELETE** `/api/services/approvals/:approvalId/cancel`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can cancel their own requests
- **Description**: Cancels a pending approval request

### 8. Get User Approval Statistics
**GET** `/api/services/approvals/stats/my-requests`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only users (role: 'user') can view their statistics
- **Description**: Retrieves statistics about user's approval requests

### 9. Get Service Owner Approval Statistics
**GET** `/api/services/approvals/stats/service-owner`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only vendors (role: 'vendor') can view their statistics
- **Description**: Retrieves statistics about approval requests for vendor's services

### 10. Get All Approval Requests (Admin)
**GET** `/api/services/approvals/admin/all`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only admins can access
- **Query Parameters**:
  - `status` (optional): Filter by status
- **Description**: Retrieves all approval requests in the system

### 11. Cleanup Expired Approvals (Admin)
**POST** `/api/services/approvals/admin/cleanup`

- **Authentication**: Required (Bearer token)
- **Authorization**: Only admins can access
- **Description**: Marks expired approval requests as rejected

## Authorization Rules

1. **Request Creation**: Only users with role 'user' can request service approvals
2. **Approval Management**: Only service owners (vendors) can approve/reject requests for their services
3. **Request Cancellation**: Only the requester can cancel their own pending requests
4. **View Access**: Requester, service owner, or admin can view approval details
5. **Admin Access**: Admins can view all requests and perform cleanup operations

## Business Logic

### Request Creation
- Event must exist and belong to the requesting user
- Service must exist and be active
- No duplicate requests for the same event-service pair
- Previous rejected requests can be replaced with new ones

### Approval Process
- Only pending requests can be approved or rejected
- Expired requests cannot be processed
- Approval automatically creates the EventService link
- Rejection requires a reason and prevents auto-linking

### Expiration Handling
- Requests expire after 7 days
- Expired requests are automatically marked as rejected
- Cleanup can be run manually or as a scheduled job

### Status Management
- **pending**: Initial status, awaiting vendor action
- **approved**: Vendor approved, EventService link created
- **rejected**: Vendor rejected or request expired

## Integration with Event-Service System

The approval system integrates seamlessly with the existing event-service linking:

1. **Request Phase**: User requests approval via `/api/events/:eventId/services/:serviceId`
2. **Approval Phase**: Vendor manages requests via service approval endpoints
3. **Linking Phase**: Approved requests automatically create EventService entries
4. **Management Phase**: Linked services can be managed via existing event-service endpoints

## Error Handling

The system handles various error scenarios:
- Event not found or not owned by user
- Service not found or inactive
- Duplicate approval requests
- Expired requests
- Unauthorized access attempts
- Invalid status transitions

## Testing

A comprehensive test suite is available in `test-service-approvals.js` that covers:
- User registration and authentication
- Event and service creation
- Approval request creation
- Vendor approval/rejection workflow
- Statistics retrieval
- Admin functionality
- Error scenarios

To run the tests:
```bash
node test-service-approvals.js
```

## Usage Examples

### Requesting Service Approval
```javascript
const response = await axios.post('/api/services/approvals/request/EVENT_ID/SERVICE_ID', {}, {
  headers: { 'Authorization': `Bearer ${userToken}` }
});
```

### Approving a Request
```javascript
const response = await axios.put('/api/services/approvals/APPROVAL_ID/approve', {
  message: 'Approved with special conditions'
}, {
  headers: { 'Authorization': `Bearer ${vendorToken}` }
});
```

### Rejecting a Request
```javascript
const response = await axios.put('/api/services/approvals/APPROVAL_ID/reject', {
  rejectionReason: 'Not available on requested date'
}, {
  headers: { 'Authorization': `Bearer ${vendorToken}` }
});
```

### Getting Vendor Requests
```javascript
const response = await axios.get('/api/services/approvals/service-owner', {
  headers: { 'Authorization': `Bearer ${vendorToken}` }
});
```

## Future Enhancements

Potential future enhancements could include:
- Email notifications for approval requests
- Push notifications for mobile apps
- Bulk approval operations
- Approval templates and auto-responses
- Integration with calendar systems
- Advanced filtering and search
- Approval analytics and reporting
- Custom expiration times per service
- Approval delegation for busy vendors
