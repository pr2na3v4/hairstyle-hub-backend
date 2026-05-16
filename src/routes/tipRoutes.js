import express from 'express';
import { getSmartTips } from '../controllers/tipController.js';

const router = express.Router();

// This endpoint accepts both GET (query parameters) and POST (body payload) data lookups
router.route('/smart')
  .get(getSmartTips)
  .post(getSmartTips);

export default router;