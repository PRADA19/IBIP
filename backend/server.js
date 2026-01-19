const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Root route (important for Vercel)
app.get('/', (req, res) => {
  res.send('SmartTodo Backend is running 🚀');
});

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      completed: false
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// MARK completed
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// IMPORTANT: export app for Vercel
module.exports = app;
