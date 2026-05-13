require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/users");

// Set default environment variables if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production";
  console.log("⚠️  Using default JWT_SECRET. Set JWT_SECRET in .env for production.");
}

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/taskzy";
  console.log("⚠️  Using default MongoDB URI. Set MONGODB_URI in .env for production.");
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Taskzy Backend Server", status: "running" });
});
// ...existing code...

app.get("/api", (req, res) => {
  res.json({ message: "Taskzy API root", status: "ok" });
});

// ...existing code...
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskzy")
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Start server on port 4000
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at: http://localhost:${PORT}/api`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });



  