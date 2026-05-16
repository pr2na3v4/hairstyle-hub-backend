import express from 'express';
import { getTips } from '../controllers/tipController.js';

const router = express.Router();

// This endpoint Accepts both GET (query parameters) and POST (body payload) data lookups
router.route('/gettips')
  .get(getTips)
  .post(getTips);

export default router;