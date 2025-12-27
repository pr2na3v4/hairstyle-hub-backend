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
import verifyFirebaseToken, { verifyTokenOptional } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Haircut Routes ---

// CHANGE THIS: From "/haircuts" to "/"
// Now it correctly matches http://localhost:5000/api/haircuts
router.get("/", getAllHaircuts); 

router.get("/:id", getHaircutById);

// --- Protected Admin Routes ---
router.post("/", createHaircut);
router.put("/:id", updateHaircut);
router.delete("/:id", deleteHaircut);

// --- Like System Routes ---
router.post('/:id/like', verifyFirebaseToken, toggleLike);
router.get('/:id/like-status', verifyTokenOptional, getLikeStatus);

export default router;