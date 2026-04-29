# NMU Connect Backend

## Quick Start

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create .env file:**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

3. **Start MongoDB** (if local):
```bash
# Make sure MongoDB is running on localhost:27017
```

4. **Seed database (optional):**
```bash
npm run seed
```

5. **Run server:**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/auth/me | Get current user |
| GET | /api/appointments | List appointments |
| POST | /api/appointments | Create appointment |
| GET | /api/complaints | List complaints |
| POST | /api/complaints | Create complaint |
| GET | /api/events | List events |
| POST | /api/events/:id/rsvp | RSVP to event |
| GET | /api/tutors | List tutors |
| POST | /api/tutors/sessions | Request session |
| GET | /api/lost-items | List lost items |
| POST | /api/upload | Upload file |

## Test Accounts (after seeding)

- **Admin:** admin@nmu.edu.eg / password123
- **Faculty:** dr.ahmed@nmu.edu.eg / password123  
- **Student:** ahmed.m@nmu.edu.eg / password123
