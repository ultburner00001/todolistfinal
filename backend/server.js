import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import paymentRoutes from "./routes/payment.js";
import userRoutes from "./routes/users.js";
import todoRoutes from "./routes/todos.js";

dotenv.config();

const app = express();

// ✅ Stripe raw body support
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/api/payment/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev frontend
      "http://localhost:3000",
      "https://todolist-liard-zeta.vercel.app", // deployed frontend
      "https://todolist-git-main-mehul-swamis-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.send("🚀 Taskify Backend + Stripe + Auth is Live!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
