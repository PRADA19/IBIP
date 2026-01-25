// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
const connectDB = async () => {
  try {
    // ✅ Removed deprecated options
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();
//==============render=============
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));


// ================= ROUTES =================

// Root route
app.get("/", (req, res) => {
  res.send("SmartTodo Backend running 🚀");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add a task
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      completed: false,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================= EXPORT =================
module.exports = app;
