# NMU Connect - Data Models & Types

This document defines the data models and TypeScript-like type definitions for the NMU Connect application. These serve as a reference for frontend development and backend integration.

---

## Core Types

### User Roles
```typescript
type UserRole = 'student' | 'faculty' | 'admin';
```

### Base User
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  nameAr: string;
  role: UserRole;
  department: string;
  departmentAr: string;
  avatar?: string;
  phone?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

### Student
```typescript
interface Student extends User {
  role: 'student';
  studentId: string;        // e.g., "20230154"
  faculty: string;          // e.g., "Computer Science"
  facultyAr: string;
  level: number;            // 1-4
  gpa?: number;
  academicAdvisorId?: number;
}
```

### Faculty Member
```typescript
interface FacultyMember extends User {
  role: 'faculty';
  title: string;            // e.g., "Dr.", "Prof."
  specialization: string;
  specializationAr: string;
  officeLocation: string;
  officeHours: OfficeHour[];
}

interface OfficeHour {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string;        // "HH:mm"
  endTime: string;          // "HH:mm"
}
```

### Admin
```typescript
interface Admin extends User {
  role: 'admin';
  permissions: AdminPermission[];
}

type AdminPermission = 
  | 'manage_users'
  | 'manage_events'
  | 'manage_complaints'
  | 'view_analytics'
  | 'system_settings';
```

---

## Feature Models

### Appointment
```typescript
interface Appointment {
  id: number;
  studentId: number;
  facultyId: number;
  date: string;             // "YYYY-MM-DD"
  time: string;             // "HH:mm"
  duration: number;         // minutes
  reason: string;
  reasonAr?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

type AppointmentStatus = 
  | 'pending'      // Awaiting faculty approval
  | 'accepted'     // Confirmed
  | 'declined'     // Rejected by faculty
  | 'completed'    // Meeting done
  | 'cancelled'    // Cancelled by student
  | 'no_show';     // Student didn't attend
```

### Complaint
```typescript
interface Complaint {
  id: number;
  userId: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: Priority;
  assignedTo?: number;      // Staff user ID
  response?: string;
  responseAr?: string;
  attachments?: string[];   // File URLs
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

type ComplaintCategory = 
  | 'facilities'     // Buildings, maintenance
  | 'academic'       // Courses, grades
  | 'administrative' // Registration, documents
  | 'it'             // Technology issues
  | 'safety'         // Security concerns
  | 'other';

type ComplaintStatus = 
  | 'pending'        // Newly submitted
  | 'in_review'      // Being investigated
  | 'in_progress'    // Action being taken
  | 'resolved'       // Issue fixed
  | 'closed';        // No further action

type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### Event
```typescript
interface Event {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  date: string;             // "YYYY-MM-DD"
  startTime: string;        // "HH:mm"
  endTime: string;          // "HH:mm"
  location: string;
  locationAr: string;
  category: EventCategory;
  image?: string;           // Image URL
  organizer: string;
  organizerAr: string;
  maxCapacity?: number;
  registeredCount: number;
  isPublic: boolean;
  requiresRegistration: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

type EventCategory = 
  | 'academic'       // Lectures, seminars
  | 'social'         // Parties, gatherings
  | 'career'         // Job fairs, workshops
  | 'workshop'       // Hands-on training
  | 'sports'         // Athletic events
  | 'cultural'       // Arts, performances
  | 'other';

interface EventRSVP {
  id: number;
  eventId: number;
  userId: number;
  status: 'registered' | 'attended' | 'cancelled';
  registeredAt: string;
}
```

### Lost & Found
```typescript
interface LostFoundItem {
  id: number;
  type: 'lost' | 'found';
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: ItemCategory;
  location: string;
  locationAr?: string;
  date: string;             // When lost/found
  images?: string[];
  contactInfo: string;
  status: 'active' | 'resolved' | 'expired';
  reportedBy: number;
  claimedBy?: number;
  createdAt: string;
  updatedAt: string;
}

type ItemCategory = 
  | 'electronics'
  | 'documents'
  | 'accessories'
  | 'clothing'
  | 'keys'
  | 'bags'
  | 'other';
```

### Peer Tutoring
```typescript
interface Tutor {
  id: number;
  userId: number;
  subjects: TutorSubject[];
  bio: string;
  bioAr?: string;
  rating: number;           // 1-5
  totalSessions: number;
  availability: TutorAvailability[];
  isActive: boolean;
  hourlyRate?: number;      // Optional for paid tutoring
}

interface TutorSubject {
  subjectId: number;
  subjectName: string;
  subjectNameAr: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface TutorAvailability {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
}

interface TutoringSession {
  id: number;
  tutorId: number;
  studentId: number;
  subject: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;         // minutes
  status: SessionStatus;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

type SessionStatus = 
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'completed'
  | 'cancelled';
```

---

## API Response Types

### Standard API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Authentication Response
```typescript
interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  expiresAt?: string;
  error?: string;
}
```

---

## Notification Types

```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  timestamp: string;
  read: boolean;
  icon?: string;
  link?: string;
  data?: Record<string, any>;
}

type NotificationType = 
  | 'event'
  | 'appointment'
  | 'complaint'
  | 'announcement'
  | 'message'
  | 'system';
```

---

## Constants

### Department List
```typescript
const DEPARTMENTS = [
  { id: 'cs', name: 'Computer Science', nameAr: 'علوم الحاسب' },
  { id: 'eng', name: 'Engineering', nameAr: 'الهندسة' },
  { id: 'med', name: 'Medicine', nameAr: 'الطب' },
  { id: 'bus', name: 'Business', nameAr: 'إدارة الأعمال' },
  { id: 'sci', name: 'Science', nameAr: 'العلوم' },
  { id: 'art', name: 'Arts & Humanities', nameAr: 'الآداب والعلوم الإنسانية' }
];
```

### Student Levels
```typescript
const STUDENT_LEVELS = [
  { level: 1, name: 'First Year', nameAr: 'السنة الأولى' },
  { level: 2, name: 'Second Year', nameAr: 'السنة الثانية' },
  { level: 3, name: 'Third Year', nameAr: 'السنة الثالثة' },
  { level: 4, name: 'Fourth Year', nameAr: 'السنة الرابعة' }
];
```
