// backend/routes/todos.js
import express from "express";
import jwt from "jsonwebtoken";
import Todo from "../models/Todo.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Auth middleware
function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

// ✅ Get all todos for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (err) {
    console.error("Get todos error:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✅ Add new todo (must be logged in)
router.post("/", auth, async (req, res) => {
  try {
    const { text, completed, dueDate } = req.body;

    const newTodo = new Todo({
      text,
      completed: completed || false,
      userId: req.userId, // ✅ now added automatically from token
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Add todo error:", err);
    res.status(500).json({ error: "Server error while creating todo" });
  }
});

// ✅ Update todo
router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    console.error("Update todo error:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ✅ Delete todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ msg: "Todo deleted" });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;

