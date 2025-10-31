import express from "express";
import jwt from "jsonwebtoken";
import Todo from "../models/Todo.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ---------------- AUTH MIDDLEWARE ---------------- */
function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ msg: "Invalid token" });
  }
}

/* ---------------- GET ALL TODOS ---------------- */
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (err) {
    console.error("Fetch todos error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- ADD NEW TODO ---------------- */
router.post("/", auth, async (req, res) => {
  try {
    const { text, completed, dueDate } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const newTodo = new Todo({
      text,
      completed: completed || false,
      userId: req.userId, // ✅ userId now comes from token
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Add todo error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- UPDATE TODO ---------------- */
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
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- DELETE TODO ---------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ msg: "Todo deleted" });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
