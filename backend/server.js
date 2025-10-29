import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "your_backup_mongo_uri", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Import Routes
import todoRoutes from "./routes/todo.js";
app.use("/api/todos", todoRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("To-Do Backend is running successfully 🚀");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
