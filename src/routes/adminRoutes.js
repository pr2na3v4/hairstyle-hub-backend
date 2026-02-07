import express from 'express';
import {addHaircutViaLink, getAllStyles, updateHaircut, deleteHaircut } from '../controllers/adminController.js';

const router = express.Router();

// Temporary path sathi (Nantar apan ithe Admin checkMiddleware lau)
router.post('/add-style', addHaircutViaLink);
router.get('/all-styles', getAllStyles);
router.put('/update/:id', updateHaircut);
router.delete('/delete/:id', deleteHaircut);
export default router;