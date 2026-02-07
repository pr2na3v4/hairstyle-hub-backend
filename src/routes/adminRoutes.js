import express from 'express';
import { addHaircutViaLink } from '../controllers/adminController.js';

const router = express.Router();

// Temporary path sathi (Nantar apan ithe Admin checkMiddleware lau)
router.post('/add-style', addHaircutViaLink);
router.get('/styles', getAllStyles);
router.delete('/haircut/:id', deleteHaircut);
router.put('/haircut/:id', updateHaircut);
export default router;