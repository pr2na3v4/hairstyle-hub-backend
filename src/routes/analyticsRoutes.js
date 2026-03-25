import express from 'express';
const router = express.Router();
import analyticsController from '../controllers/analyticsController.js';
// POST /api/analytics/save-face-data
router.post('/save-face-data', analyticsController.saveFaceData);

export default router;