import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import haircutRoutes from "./routes/haircutRoutes.js";
import commentRoutes from "./routes/commentRoutes.js"; // This looks for 'export default'import likeRoutes from "./routes/likeRoutes.js";
import authRoutes from './routes/authRoutes.js';
import verifyFirebaseToken from './middleware/authMiddleware.js';
dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: "http://127.0.0.1:5500" })); // Or your specific Live Server URL;
app.use(express.json());
app.use("/api/haircuts", haircutRoutes);
app.use("/api", commentRoutes);
app.use('/api/auth', authRoutes);
// connect database
connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
