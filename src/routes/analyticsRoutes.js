const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// POST /api/analytics/save-face-data
router.post('/save-face-data', analyticsController.saveFaceData);

export default router;