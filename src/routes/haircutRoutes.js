// src/routes/haircutRoutes.js
import express from "express";
import {
  getAllHaircuts,
  getHaircutById,
  createHaircut,
  updateHaircut,
  deleteHaircut,
} from "../controllers/haircutController.js";
import { toggleLike, getLikeStatus } from '../controllers/likeController.js';
// Import both the strict and optional middleware
import verifyFirebaseToken, { verifyTokenOptional } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Haircut Routes ---
router.get("/haircuts", getAllHaircuts);
router.get("/:id", getHaircutById);

// --- Protected Admin Routes ---
router.post("/", createHaircut);
router.put("/:id", updateHaircut);
router.delete("/:id", deleteHaircut);

// --- Like System Routes ---

// 1. POST (Strict): Requires login to perform the action
router.post('/:id/like', verifyFirebaseToken, toggleLike);

// 2. GET (Optional): Doesn't block guests, allows "hasLiked" to be false instead of 401
router.get('/:id/like-status', verifyTokenOptional, getLikeStatus);

export default router;