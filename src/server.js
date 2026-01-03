import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import haircutRoutes from "./routes/haircutRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // 1. ADD THIS IMPORT
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// 1. Production-ready CORS
app.use(cors({
  origin: "*"
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
app.use("/api/users", userRoutes); // 2. ADD THIS LINE (Links /api/users to your userRoutes.js)
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
