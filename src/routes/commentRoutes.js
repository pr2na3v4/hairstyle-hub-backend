// src/routes/commentRoutes.js
import express from "express";
import { 
    getCommentsByHaircut, 
    createComment, 
    updateComment, 
    deleteComment 
} from "../controllers/commentController.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. GET Comments for a specific haircut
// Correct path: "/:haircutId" 
// Full URL will be: GET http://localhost:5000/api/comments/694fb2e6...
router.get("/:haircutId", getCommentsByHaircut);

// 2. POST a new comment
// Correct path: "/" 
// Full URL will be: POST http://localhost:5000/api/comments
router.post("/", verifyFirebaseToken, createComment);

// 3. UPDATE/DELETE
router.put("/:id", verifyFirebaseToken, updateComment);
router.delete("/:id", verifyFirebaseToken, deleteComment);

export default router;