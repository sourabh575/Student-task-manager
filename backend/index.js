require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// --------- Middleware ----------
app.use(cors());
app.use(express.json());

// --------- Validate Environment Variables ----------
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not defined in .env. Auth will not work properly.');
}

// --------- Database Connection ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// --------- Test Route ----------
app.get('/', (req, res) => {
  res.send("Backend Server is Running");
});

// --------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
