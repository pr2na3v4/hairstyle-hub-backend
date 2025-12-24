import express from "express";
import { syncUser } from "../controllers/userController.js";
import { firebaseAuth } from "../middleware/firebaseAuth.js";

const router = express.Router();

// This route is now protected. Only users with a valid Firebase token can sync.
router.post("/sync", firebaseAuth, syncUser);

export default router;