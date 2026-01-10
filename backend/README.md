# 🔧 Backend - Enginow Task Manager

Express.js backend with MongoDB, JWT authentication, and task management API.

## 📋 Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Error Handling](#error-handling)

---

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env` File

```env
MONGO_URI=mongodb://127.0.0.1:27017/Tasks
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

### 3. Ensure MongoDB is Running

```bash
# Local MongoDB
mongod

# Or connect to MongoDB Atlas by updating MONGO_URI
```

### 4. Start Server

```bash
# Development with auto-reload
npx nodemon index.js

# Production
npm start
# or
node index.js
```

✅ Server running at: `http://localhost:5000`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/Tasks` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing key (keep secret!) | `your_secret_key_here` |

---

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js              # User schema
│   └── Task.js              # Task schema
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── taskRoutes.js        # Task CRUD endpoints
├── middleware/
│   └── authMiddleware.js    # JWT verification
├── index.js                 # Express app & server
├── package.json             # Dependencies
├── .env                     # Environment variables
└── .gitignore              # Git ignore rules
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-10T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Email already registered / Invalid input / Password mismatch
- `500` - Server error

---

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-10T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password
- `500` - Server error

---

### Task Endpoints (Protected - Require JWT Token)

All task endpoints require `Authorization: Bearer <token>` header.

#### 3. Get All Tasks
```http
GET /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Learn React",
    "description": "Complete React tutorial",
    "priority": "high",
    "dueDate": "2026-01-15T00:00:00.000Z",
    "completed": false,
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T10:00:00.000Z"
  }
]
```

---

#### 4. Create Task
```http
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Learn React",
  "description": "Complete React tutorial",
  "priority": "high",
  "dueDate": "2026-01-15"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Learn React",
  "description": "Complete React tutorial",
  "priority": "high",
  "dueDate": "2026-01-15T00:00:00.000Z",
  "completed": false,
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-10T10:00:00.000Z"
}
```

---

#### 5. Get Single Task
```http
GET /tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Learn React",
  "description": "Complete React tutorial",
  "priority": "high",
  "dueDate": "2026-01-15T00:00:00.000Z",
  "completed": false,
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-10T10:00:00.000Z"
}
```

**Error Responses:**
- `403` - Not authorized to access this task
- `404` - Task not found

---

#### 6. Update Task
```http
PUT /tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Learn React Advanced",
  "description": "Complete React advanced tutorial",
  "priority": "medium",
  "dueDate": "2026-01-20",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Learn React Advanced",
  "description": "Complete React advanced tutorial",
  "priority": "medium",
  "dueDate": "2026-01-20T00:00:00.000Z",
  "completed": true,
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-10T12:00:00.000Z"
}
```

---

#### 7. Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Task Deleted Successfully"
}
```

**Error Responses:**
- `403` - Not authorized to delete this task
- `404` - Task not found

---

## 🗄️ Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (hashed, required, min 6 chars),
  createdAt: Date (default: now)
}
```

### Task Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User, required),
  title: String,
  description: String,
  priority: String (low, medium, high),
  dueDate: Date,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Middleware

### Auth Middleware (`/middleware/authMiddleware.js`)

Validates JWT token and extracts user information.

**Usage:**
```javascript
router.use(authMiddleware);  // Apply to all routes
router.get('/', authMiddleware, controller);  // Apply to specific route
```

**Behavior:**
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies token signature using JWT_SECRET
3. Checks token expiry (1 day)
4. Attaches user info to `req.user` object
5. Allows request to proceed or returns 401 error

**Error Responses:**
- `401` - No token provided
- `401` - Invalid token format
- `401` - Token expired
- `401` - Invalid token signature

---

## ⚠️ Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Task fetched successfully |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | No token or expired token |
| 403 | Forbidden | User doesn't own the resource |
| 404 | Not Found | Task not found |
| 500 | Server Error | Database connection failed |

---

## 🔐 Security Best Practices

### Implemented

✅ Passwords hashed with bcryptjs (10 salt rounds)
✅ JWT tokens with 1-day expiry
✅ Authorization header validation
✅ User isolation (can only access own tasks)
✅ Input validation on all endpoints
✅ Error messages don't leak sensitive info
✅ CORS enabled for frontend communication

### For Production

⚠️ Change `JWT_SECRET` to a strong random string
⚠️ Enable HTTPS/SSL
⚠️ Use environment-specific configs
⚠️ Add rate limiting
⚠️ Add request logging
⚠️ Use MongoDB Atlas with authentication
⚠️ Set NODE_ENV=production
⚠️ Add API versioning (/api/v1/)

---

## 📝 Sample Requests

### Using curl

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456","confirmPassword":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Create Task (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node","description":"Node.js basics","priority":"high","dueDate":"2026-01-15"}'

# Get Tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Debugging

### Enable Detailed Logging

```javascript
// In index.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check MongoDB Connection

```javascript
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB error:', err);
});
```

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)

---

## ✅ Checklist for Deployment

- [ ] Set NODE_ENV=production
- [ ] Change JWT_SECRET to strong random key
- [ ] Update MONGO_URI to production database
- [ ] Enable HTTPS
- [ ] Setup environment variables on hosting platform
- [ ] Add rate limiting middleware
- [ ] Setup request logging
- [ ] Add API versioning
- [ ] Test all endpoints
- [ ] Monitor error logs

---

Happy coding! 🚀
