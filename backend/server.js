// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import paymentRoutes from "./routes/payment.js";
import userRoutes from "./routes/users.js";
import todoRoutes from "./routes/todos.js";

dotenv.config();

const app = express();

// ✅ Basic middlewares
app.use(express.json({ limit: "10mb" })); // handle large payloads safely

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev frontend (Vite)
      "http://localhost:3000", // local dev (CRA)
      "https://todolistfinal1.vercel.app", // deployed frontend
      "https://todolistfinal1-git-main-ultburners-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI missing in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/payment", paymentRoutes); // fake payment routes

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Taskify Backend + Payment Gateway + Auth is Live!");
});

// ✅ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
