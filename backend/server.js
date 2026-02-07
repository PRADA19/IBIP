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
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();


// ================= ROUTES =================

// Health check (Render wake-up)
app.get("/", (req, res) => {
  res.send("🚀 SmartTodo Backend running");
});


// ================= TASK ROUTES =================

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// POST new task
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title required" });
    }

    const task = await Task.create({
      title: title.trim(),
      completed: false
    });

    res.status(201).json(task);

  } catch {
    res.status(500).json({ error: "Failed to add task" });
  }
});


// PUT update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Not found" });

    res.json(task);

  } catch {
    res.status(500).json({ error: "Failed to update task" });
  }
});


// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch {
    res.status(500).json({ error: "Failed to delete task" });
  }
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
