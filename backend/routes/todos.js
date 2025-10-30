import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define Todo model
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

// ✅ Get all todos (only user’s)
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: "Server error while fetching todos" });
  }
});

// ✅ Add new todo
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      userId: req.user,
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ msg: "Error creating todo" });
  }
});

// ✅ Update todo
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ msg: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: "Error updating todo" });
  }
});

// ✅ Delete todo
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!deleted) return res.status(404).json({ msg: "Todo not found" });
    res.json({ msg: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting todo" });
  }
});

export default router;
