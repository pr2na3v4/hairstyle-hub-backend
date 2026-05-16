import express from 'express';
import { getTips } from '../controllers/tipController.js';

const router = express.Router();

// Mount the GET endpoint
router.get('/', getTips);

export default router;