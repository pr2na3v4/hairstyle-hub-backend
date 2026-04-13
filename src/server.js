import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import haircutRoutes from "./routes/haircutRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS
app.use(cors({ origin: "*" }));

// Body parser
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/haircuts",  haircutRoutes);
app.use("/api/comments",  commentRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/face-analysis", analyticsRoutes);
app.use("/api/auth",      authRoutes);
app.use("/api/users",     userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found — ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

// PORT fallback prevents crash if env var is missing on Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});