const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must belong to a user']
  },
  title: String,
  description: String,
  priority: String,
  dueDate: Date,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('Task', TaskSchema);
