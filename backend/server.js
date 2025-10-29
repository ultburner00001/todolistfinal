const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todos");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin:[
      "http://localhost:3000",
    "https://todo-frontend-xxxx.vercel.app"
      ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ✅ Routes
app.use("/todos", todoRoutes);
app.use("/users", userRoutes);

// ✅ Root
app.get("/", (req, res) => res.send("🚀 API Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));
