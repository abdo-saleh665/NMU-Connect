# NMU Connect - API Documentation

This document describes the API endpoints and services available for the NMU Connect application.

---

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.nmu-connect.edu.eg/api
```

## Configuration

Set your API URL in `.env.local`:
```bash
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_MOCK_API=false
```

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### POST `/auth/login`
Authenticate user and receive access token.

**Request:**
```json
{
  "email": "student@nmu.edu.eg",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "student@nmu.edu.eg",
    "name": "Ahmed Mohamed",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/logout`
Invalidate the current session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/auth/me`
Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@nmu.edu.eg",
    "name": "Ahmed Mohamed",
    "role": "student"
  }
}
```

#### POST `/auth/refresh`
Refresh the access token.

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Appointments

### Endpoints

#### GET `/appointments`
Get appointments for the current user.

**Query Parameters:**
- `status` - Filter by status (pending, accepted, etc.)
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "facultyId": 5,
      "date": "2024-12-28",
      "time": "10:00",
      "reason": "Project Discussion",
      "status": "pending",
      "createdAt": "2024-12-24T10:00:00Z"
    }
  ]
}
```

#### GET `/appointments/:id`
Get a single appointment by ID.

#### POST `/appointments`
Create a new appointment request.

**Request:**
```json
{
  "facultyId": 5,
  "date": "2024-12-28",
  "time": "10:00",
  "reason": "Project Discussion",
  "notes": "About final year project"
}
```

#### PATCH `/appointments/:id/status`
Update appointment status (faculty only).

**Request:**
```json
{
  "status": "accepted",
  "notes": "Confirmed. See you then!"
}
```

#### PATCH `/appointments/:id/cancel`
Cancel an appointment.

#### GET `/appointments/slots`
Get available time slots.

**Query Parameters:**
- `facultyId` - Faculty member ID
- `date` - Date to check (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": ["09:00", "10:00", "11:00", "14:00", "15:00"]
}
```

---

## Complaints

### Endpoints

#### GET `/complaints`
Get complaints (filtered by user role).

**Query Parameters:**
- `status` - Filter by status
- `category` - Filter by category

#### GET `/complaints/:id`
Get a single complaint.

#### POST `/complaints`
Submit a new complaint.

**Request:**
```json
{
  "title": "Library Opening Hours",
  "description": "The library closes too early...",
  "category": "facilities",
  "priority": "medium"
}
```

#### PATCH `/complaints/:id`
Update complaint status (admin/staff only).

**Request:**
```json
{
  "status": "in_review",
  "response": "We are looking into this issue."
}
```

---

## Events

### Endpoints

#### GET `/events`
Get all events.

**Query Parameters:**
- `category` - Filter by category
- `startDate` - Filter by start date
- `endDate` - Filter by end date

#### GET `/events/upcoming`
Get upcoming events.

**Query Parameters:**
- `limit` - Number of events (default: 5)

#### GET `/events/:id`
Get event details.

#### POST `/events/:id/rsvp`
RSVP to an event.

#### DELETE `/events/:id/rsvp`
Cancel RSVP.

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "status": 400
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## Frontend Usage

### Import API Services

```javascript
import { authApi, appointmentsApi, eventsApi } from './api';

// Or individual functions
import { login, logout } from './api/auth';
```

### Example: Login

```javascript
import { login } from './api/auth';

const handleLogin = async (email, password) => {
  const result = await login({ email, password });
  
  if (result.success) {
    // Store user in context
    setUser(result.user);
  } else {
    // Show error
    toast.error(result.error);
  }
};
```

### Example: Fetch Appointments

```javascript
import { getAppointments } from './api/appointments';

const fetchAppointments = async () => {
  const result = await getAppointments({ status: 'pending' });
  
  if (result.success) {
    setAppointments(result.appointments);
  }
};
```

---

## Mock Mode

When `VITE_ENABLE_MOCK_API=true`, the API client logs requests but returns empty mock responses. Implement mock data in individual service files when needed.
