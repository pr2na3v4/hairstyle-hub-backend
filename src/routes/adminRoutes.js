import express from 'express';
import { addHaircutViaLink } from '../controllers/adminController.js';

const router = express.Router();

// Temporary path sathi (Nantar apan ithe Admin checkMiddleware lau)
router.post('/add-style', addHaircutViaLink);

export default router;