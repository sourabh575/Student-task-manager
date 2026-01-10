const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --------- Apply Auth Middleware to All Task Routes ----------
router.use(authMiddleware);

// POST /api/tasks → Create Task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const newTask = new Task({
      userId: req.user.id,
      title,
      description,
      priority,
      dueDate: new Date(dueDate),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);

  } catch (err) {
    res.status(400).json({ message: "Error Creating Task", error: err.message });
  }
});

// GET /api/tasks → Get All Tasks for Current User
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: "Error Fetching Tasks", error: err.message });
  }
});

// GET /api/tasks/:id → Get Single Task (verify ownership)
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    // Verify task belongs to current user
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this task" });
    }

    res.json(task);

  } catch (err) {
    res.status(400).json({ message: "Invalid Task ID", error: err.message });
  }
});

// PUT /api/tasks/:id → Update Task (verify ownership)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    // Find task and verify ownership
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        dueDate: new Date(dueDate),
        completed,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(updatedTask);

  } catch (err) {
    res.status(400).json({ message: "Error Updating Task", error: err.message });
  }
});

// DELETE /api/tasks/:id → Delete Task (verify ownership)
router.delete('/:id', async (req, res) => {
  try {
    // Find task and verify ownership
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task Deleted Successfully" });

  } catch (err) {
    res.status(400).json({ message: "Error Deleting Task", error: err.message });
  }
});

module.exports = router;
