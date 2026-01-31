
  # SkillX - Student Skill Exchange Platform

A modern, full-stack skill exchange platform where students can trade skills, take courses, attend workshops, and grow together.

## 🚀 Features

- **Skill Exchange**: Trade skills with other students using a credit-based system
- **Courses**: Create and enroll in courses with progress tracking
- **Workshops**: Host or attend live/recorded workshops
- **Real-time Messaging**: Chat with other users in real-time
- **Dashboard**: Track your swaps, credits, and activity
- **User Profiles**: Showcase your skills and reviews

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui components
- Framer Motion for animations
- Socket.IO client for real-time features

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Socket.IO for real-time communication
- bcrypt for password hashing

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or pnpm

## 🏃 Getting Started

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillx
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5174
```

### 3. Start MongoDB

Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB Atlas connection string.

### 4. Seed the Database (Optional)

```bash
cd server
npm run seed
```

This creates test accounts and sample data:
- Email: `alex@skillx.com`, Password: `password123`
- Email: `sarah@skillx.com`, Password: `password123`
- And more...

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The app will be available at `http://localhost:5174`

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── app/               # App components and pages
│   │   ├── components/    # Reusable UI components
│   │   └── pages/         # Page components
│   ├── contexts/          # React contexts (Auth, Socket)
│   ├── lib/               # API client and utilities
│   └── styles/            # CSS and Tailwind styles
│
├── server/                 # Backend source code
│   └── src/
│       ├── models/        # Mongoose models
│       ├── routes/        # Express routes
│       ├── middleware/    # Auth middleware
│       └── socket/        # Socket.IO handlers
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Skills
- `GET /api/skills` - Get all skills (with filters)
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/progress` - Update progress

### Workshops
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops/:id/register` - Register for workshop

### Swaps
- `GET /api/swaps` - Get user's swaps
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/complete` - Complete swap

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages` - Send message

### Dashboard
- `GET /api/dashboard` - Get dashboard data

## 🔒 Authentication

The app uses JWT tokens for authentication. Tokens are stored in `localStorage` and automatically included in API requests via axios interceptors.

## 📡 Real-time Features

Socket.IO is used for:
- Real-time messaging
- Online presence tracking
- Typing indicators
- Notifications
- Workshop live chat

## 🎨 Theme

The app uses a blackish theme (#050505) with teal (#14b8a6) accents. Fonts used:
- Plus Jakarta Sans (headings)
- Inter (body text)

## 📄 License

MIT
  