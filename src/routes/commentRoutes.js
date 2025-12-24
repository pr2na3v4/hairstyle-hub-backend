import express from 'express';
const router = express.Router();
import verifyFirebaseToken from '../middleware/authMiddleware.js';
import { 
    createComment, 
    getCommentsByHaircut, 
    deleteComment, 
    updateComment 
} from '../controllers/commentController.js';

// Public: View comments
router.get('/comments/:haircutId', getCommentsByHaircut);

// Protected: Only logged-in users can post, edit, or delete
router.post('/comments', verifyFirebaseToken, createComment);
router.put('/comments/:id', verifyFirebaseToken, updateComment);
router.delete('/comments/:id', verifyFirebaseToken, deleteComment);

export default router;