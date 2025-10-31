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
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

// ✅ Add todo
router.post("/", auth, async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text, userId: req.userId });
  await todo.save();
  res.json(todo);
});

// ✅ Update todo
router.put("/:id", auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(todo);
});

// ✅ Delete todo
router.delete("/:id", auth, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ msg: "Todo deleted" });
});

export default router;
