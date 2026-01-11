# 📋 Enginow - Task Manager Application

A full-stack MERN (MongoDB, Express, React, Node.js) task management application with user authentication and real-time task management.

## 🎯 Features

### ✅ User Authentication
- **Secure Signup** - Register with email and password
- **Login** - Secure login with JWT authentication
- **Password Hashing** - Passwords encrypted with bcryptjs
- **Token Management** - JWT tokens with 1-day expiry
- **Logout** - Secure session termination

### ✅ Task Management
- **Create Tasks** - Add new tasks with title, description, priority, and due date
- **Read Tasks** - View all personal tasks (user-specific)
- **Update Tasks** - Edit task details with modal interface
- **Delete Tasks** - Remove tasks permanently
- **Mark Complete** - Toggle task completion status

### ✅ Smart Filtering
- **Status Filter** - All/Pending/Completed tasks
- **Priority Filter** - Filter by Low/Medium/High priority
- **Search** - Real-time search by title or description
- **Statistics** - View task counts and completion status

### ✅ User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful UI** - Modern gradient design with smooth animations
- **Error Handling** - Clear error messages and user feedback
- **Loading States** - Visual feedback during operations
- **Protected Routes** - Only authenticated users can access tasks

---

## 🏗️ Project Structure

```
Enginow/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   └── Task.js          # Task schema with userId reference
│   ├── routes/
│   │   ├── authRoutes.js    # POST /api/auth/signup, /api/auth/login
│   │   └── taskRoutes.js    # CRUD operations for tasks
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification and user extraction
│   ├── index.js             # Express app setup
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx        # Login form
    │   │   ├── Signup.jsx       # Signup form
    │   │   ├── TaskList.jsx     # Main task list page
    │   │   ├── TaskCard.jsx     # Individual task component
    │   │   ├── AddTaskForm.jsx  # Create task form
    │   │   ├── Modal.jsx        # Edit task modal
    │   │   ├── FilterBar.jsx    # Filter and search tasks
    │   │   ├── Header.jsx       # Navigation header
    │   │   └── ErrorBoundary.jsx# Error handling
    │   ├── utils/
    │   │   ├── axiosInstance.js # Axios with interceptors
    │   │   └── api.js           # Auth utility functions
    │   ├── App.jsx              # Main app with routing
    │   └── main.jsx             # React entry point
    └── package.json             # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/Tasks
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (update MONGO_URI in .env)
   ```

5. **Start backend server**
   ```bash
   npm start
   # or with nodemon for development
   npx nodemon index.js
   ```

   ✅ Backend running at: `https://student-task-manager-backend-wcae.onrender.com/`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   ✅ Frontend running at: `https://student-task-manager-topaz.vercel.app/`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | `{name, email, password, confirmPassword}` |
| POST | `/api/auth/login` | User login | `{email, password}` |

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-10T10:00:00Z"
  }
}
```

### Tasks (Protected - require Authorization header)

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/api/tasks` | Get all user's tasks | `Authorization: Bearer <token>` |
| POST | `/api/tasks` | Create new task | `Authorization: Bearer <token>` |
| PUT | `/api/tasks/:id` | Update task | `Authorization: Bearer <token>` |
| DELETE | `/api/tasks/:id` | Delete task | `Authorization: Bearer <token>` |

**Create/Update Task Body:**
```json
{
  "title": "Learn React",
  "description": "Complete React tutorial",
  "priority": "high",
  "dueDate": "2026-01-15",
  "completed": false
}
```

---

## 🔐 Security Features

### Backend Security
- ✅ **Password Hashing** - bcryptjs with salt rounds of 10
- ✅ **JWT Tokens** - Secure token generation and verification
- ✅ **Authorization** - Auth middleware on protected routes
- ✅ **User Isolation** - Tasks filtered by userId
- ✅ **Ownership Verification** - Users can only access/modify their own tasks
- ✅ **Error Handling** - Generic error messages (no info leakage)

### Frontend Security
- ✅ **Token Storage** - JWT stored in localStorage
- ✅ **Axios Interceptors** - Automatic token injection to headers
- ✅ **401 Handling** - Automatic redirect to login on token expiry
- ✅ **Protected Routes** - Route guards for authenticated pages
- ✅ **Public Routes** - Redirect logged-in users away from auth pages

---

## 🔄 Authentication Flow

### Signup Flow
```
User enters credentials
  ↓
Frontend validates input
  ↓
POST /api/auth/signup
  ↓
Backend validates & checks existing email
  ↓
Password hashed with bcryptjs
  ↓
User saved to MongoDB
  ↓
JWT token generated
  ↓
Token stored in localStorage
  ↓
Redirect to home page
```

### Login Flow
```
User enters email & password
  ↓
Frontend validates input
  ↓
POST /api/auth/login
  ↓
Backend finds user by email
  ↓
Password compared with bcrypt
  ↓
JWT token generated (1-day expiry)
  ↓
Token stored in localStorage
  ↓
Redirect to home page
```

### Protected Request Flow
```
Frontend makes API request
  ↓
Axios interceptor adds Bearer token to header
  ↓
Backend receives request with Authorization header
  ↓
Auth middleware verifies token
  ↓
User info extracted and attached to req.user
  ↓
Route handler accesses user info
  ↓
Tasks filtered by userId
```

---

## 🎨 UI Features

### Pages

1. **Login Page**
   - Email and password fields
   - Error and success messages
   - Link to signup
   - Beautiful gradient background

2. **Signup Page**
   - Name, email, password, confirm password fields
   - Form validation
   - Error handling
   - Link to login

3. **Task List Page** (Protected)
   - Task display with priority badges
   - Status indicators (Pending/Completed)
   - FilterBar with search, status, and priority filters
   - Task statistics
   - Complete/Edit/Delete actions per task

4. **Add Task Page** (Protected)
   - Form with title, description, priority, due date
   - Validation
   - Success/error feedback
   - Auto-redirect after creation

### Components

- **TaskCard** - Individual task with actions
- **Modal** - Edit task interface with delete confirmation
- **FilterBar** - Advanced filtering and search
- **Header** - Navigation with user info and logout
- **ErrorBoundary** - Error handling wrapper

---

## 🛠️ Development

### Running Tests

```bash
# Frontend (if jest configured)
cd frontend && npm test

# Backend (if jest configured)
cd backend && npm test
```

### Building for Production

```bash
# Frontend build
cd frontend && npm run build

# Backend can be deployed as-is with node index.js
```

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **vite** - Build tool

---

## 🚨 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env
- Verify IP whitelist if using Atlas


**JWT_SECRET not defined**
- Add JWT_SECRET to .env file

### Frontend Issues

**Blank Login/Signup Page**
- Check if backend is running on port 5000
- Check browser console for errors
- Clear cache: `Ctrl+Shift+Delete`

**Axios 401 Errors**
- Ensure token is stored in localStorage
- Check if JWT_SECRET matches between backend and frontend
- Try logging out and logging back in

**Cannot Create Tasks**
- Ensure you're logged in
- Check browser network tab for error details
- Verify backend is running

---

## 📚 Learning Resources

- [MERN Stack Tutorial](https://www.mongodb.com/developer/languages/javascript/mern-stack-guide/)
- [JWT Authentication](https://jwt.io/introduction)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

---

## 📝 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Author

Created as a full-stack MERN project for task management and authentication learning.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Task Managing! 🚀**
