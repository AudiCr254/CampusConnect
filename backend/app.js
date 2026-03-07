const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const noteRoutes = require("./routes/noteRoutes");
const unitRoutes = require("./routes/unitRoutes"); // Changed from topicRoutes
const topicRoutes = require("./routes/topicRoutes"); // New topic routes
const errorHandler = require("./middleware/errorHandler");

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
  credentials: true
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded documents)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusConnect API is running",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api", noteRoutes);
app.use("/api", unitRoutes); // Changed from topicRoutes
app.use("/api", topicRoutes); // New topic routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
