import express from 'express';
import analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// POST /api/analytics/save-face-data
router.post('/save-face-data', analyticsController.saveFaceData);

export default router;