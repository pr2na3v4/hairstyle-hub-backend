// routes/analyticsRoutes.js
import express from 'express';
import analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// This now specifically handles syncing the AI result to the User Profile
// POST /api/analytics/sync-scan-to-user
router.post('/sync-scan-to-user', analyticsController.saveFaceData);

export default router;