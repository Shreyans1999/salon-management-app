Here is a comprehensive API documentation for all the features:-

1. Authentication APIs:
```javascript
/**
 * Authentication APIs
 * Base URL: /api/auth
 */

// Register new user
POST /api/auth/register
Request:
{
    "name": "string",
    "email": "string",
    "password": "string",
    "phone": "string"
}
Response: {
    "message": "Registration successful",
    "user": {
        "id": "number",
        "name": "string",
        "email": "string",
        "role": "string"
    }
}

// Login user
POST /api/auth/login
Request:
{
    "email": "string",
    "password": "string"
}
Response: {
    "token": "string",
    "user": {
        "id": "number",
        "name": "string",
        "email": "string",
        "role": "string"
    }
}

// Reset password request
POST /api/auth/reset-password-request
Request:
{
    "email": "string"
}
Response: {
    "message": "Password reset email sent"
}

// Reset password
PUT /api/auth/reset-password
Request:
{
    "token": "string",
    "newPassword": "string"
}
Response: {
    "message": "Password reset successful"
}
```

2. Services APIs:
```javascript
/**
 * Services APIs
 * Base URL: /api/services
 * Required Header: Authorization: Bearer <token>
 */

// Get all services
GET /api/services
Query Parameters:
- category?: string
- page?: number
- limit?: number
Response: {
    "services": [{
        "id": "number",
        "name": "string",
        "description": "string",
        "price": "number",
        "duration": "number",
        "category": "string",
        "image": "string"
    }],
    "totalPages": "number",
    "currentPage": "number"
}

// Get single service
GET /api/services/:id
Response: {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "duration": "number",
    "category": "string",
    "image": "string"
}

// Create service (Admin only)
POST /api/services
Request:
{
    "name": "string",
    "description": "string",
    "price": "number",
    "duration": "number",
    "category": "string",
    "image": "string"
}
Response: {
    "message": "Service created successfully",
    "service": {...}
}

// Update service (Admin only)
PUT /api/services/:id
Request:
{
    "name": "string",
    "description": "string",
    "price": "number",
    "duration": "number",
    "category": "string",
    "image": "string"
}
Response: {
    "message": "Service updated successfully",
    "service": {...}
}

// Delete service (Admin only)
DELETE /api/services/:id
Response: {
    "message": "Service deleted successfully"
}
```

3. Appointments APIs:
```javascript
/**
 * Appointments APIs
 * Base URL: /api/appointments
 * Required Header: Authorization: Bearer <token>
 */

// Get available time slots
GET /api/appointments/available-slots
Query Parameters:
- date: string (YYYY-MM-DD)
- serviceId: number
- staffId: number
Response: {
    "availableSlots": ["HH:mm"]
}

// Create appointment
POST /api/appointments
Request:
{
    "serviceId": "number",
    "staffId": "number",
    "date": "string", // YYYY-MM-DD
    "time": "string", // HH:mm
    "notes": "string"
}
Response: {
    "message": "Appointment created successfully",
    "appointment": {...},
    "paymentIntent": {
        "clientSecret": "string"
    }
}

// Get user appointments
GET /api/appointments
Query Parameters:
- status?: string
- page?: number
- limit?: number
Response: {
    "appointments": [{
        "id": "number",
        "date": "string",
        "time": "string",
        "status": "string",
        "Service": {...},
        "Staff": {...}
    }],
    "totalPages": "number",
    "currentPage": "number"
}

// Get appointment details
GET /api/appointments/:id
Response: {
    "id": "number",
    "date": "string",
    "time": "string",
    "status": "string",
    "notes": "string",
    "Service": {...},
    "Staff": {...},
    "User": {...}
}

// Cancel appointment
PUT /api/appointments/:id/cancel
Response: {
    "message": "Appointment cancelled successfully"
}

// Reschedule appointment
PUT /api/appointments/:id/reschedule
Request:
{
    "date": "string",
    "time": "string"
}
Response: {
    "message": "Appointment rescheduled successfully",
    "appointment": {...}
}
```

4. Staff APIs:
```javascript
/**
 * Staff APIs
 * Base URL: /api/staff
 * Required Header: Authorization: Bearer <token>
 */

// Get all staff
GET /api/staff
Query Parameters:
- specialization?: string
Response: [{
    "id": "number",
    "name": "string",
    "specialization": "string",
    "workingHours": {
        "start": "string",
        "end": "string"
    },
    "isAvailable": "boolean"
}]

// Get staff availability
GET /api/staff/:id/availability
Query Parameters:
- date: string (YYYY-MM-DD)
Response: {
    "availableSlots": ["HH:mm"]
}

// Create staff (Admin only)
POST /api/staff
Request:
{
    "name": "string",
    "specialization": "string",
    "workingHours": {
        "start": "string",
        "end": "string"
    }
}
Response: {
    "message": "Staff created successfully",
    "staff": {...}
}

// Update staff availability (Admin only)
PUT /api/staff/:id/availability
Request:
{
    "isAvailable": "boolean",
    "workingHours": {
        "start": "string",
        "end": "string"
    }
}
Response: {
    "message": "Staff availability updated successfully"
}
```

5. Reviews APIs:
```javascript
/**
 * Reviews APIs
 * Base URL: /api/reviews
 * Required Header: Authorization: Bearer <token>
 */

// Create review
POST /api/reviews
Request:
{
    "appointmentId": "number",
    "rating": "number",
    "comment": "string"
}
Response: {
    "message": "Review submitted successfully",
    "review": {...}
}

// Get reviews for service
GET /api/reviews/service/:serviceId
Query Parameters:
- page?: number
- limit?: number
Response: {
    "reviews": [{
        "id": "number",
        "rating": "number",
        "comment": "string",
        "User": {
            "name": "string"
        },
        "createdAt": "string",
        "staffResponse": "string"
    }],
    "totalPages": "number",
    "currentPage": "number"
}

// Add staff response (Admin only)
PUT /api/reviews/:id/response
Request:
{
    "staffResponse": "string"
}
Response: {
    "message": "Response added successfully"
}
```

6. Payment APIs:
```javascript
/**
 * Payment APIs
 * Base URL: /api/payments
 * Required Header: Authorization: Bearer <token>
 */

// Get Stripe public key
GET /api/payments/config
Response: {
    "publishableKey": "string"
}

// Create payment intent
POST /api/payments/create-intent
Request:
{
    "appointmentId": "number"
}
Response: {
    "clientSecret": "string"
}

// Confirm payment
POST /api/payments/confirm
Request:
{
    "appointmentId": "number",
    "paymentIntentId": "string"
}
Response: {
    "message": "Payment confirmed successfully"
}

// Get payment history
GET /api/payments/history
Query Parameters:
- page?: number
- limit?: number
Response: {
    "payments": [{
        "id": "number",
        "amount": "number",
        "status": "string",
        "createdAt": "string",
        "Appointment": {...}
    }],
    "totalPages": "number",
    "currentPage": "number"
}
```

Error Responses:
```javascript
/**
 * Standard Error Responses
 */
{
    "message": "string", // Error message
    "errors": [...],     // Optional validation errors
    "code": "string"     // Optional error code
}

Status Codes:
200: Success
201: Created
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
422: Validation Error
500: Server Error
```
