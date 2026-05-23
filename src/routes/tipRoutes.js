import express from 'express';
import { getTips } from '../controllers/tipController.js';

const router = express.Router();

// This endpoint accepts both GET (query parameters) and POST (body payload) data lookups
// NEW MATCHING PATH for the frontend: /api/tips/smart
router.route('/smart')
  .get(getTips)
  .post(getTips);

export default router;