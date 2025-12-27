import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import haircutRoutes from "./routes/haircutRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// 1. Production-ready CORS
app.use(cors({
  origin: ["http://127.0.0.1:5500", "https://hairstylehub.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] // Required for Firebase tokens
}));

// 2. Body Parser
app.use(express.json());

// 3. Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 4. API Routes
// Note: Like logic is handled inside haircutRoutes.js via /api/haircuts/:id/like
app.use("/api/haircuts", haircutRoutes); 
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// 5. 404 Handler (For non-existent routes)
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// 6. Global Error Handler (Prevents server from crashing and sends JSON to frontend)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
