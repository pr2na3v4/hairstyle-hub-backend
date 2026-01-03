import express from 'express';
import { 
    getProfile, 
    getUserLikes, 
    getUserComments 
} from '../controllers/userController.js';
import verifyFirebaseToken from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is now protected. Only users with a valid Firebase token can sync.
router.use(verifyFirebaseToken);

router.get('/me', getProfile);
router.get('/me/likes', getUserLikes);
router.get('/me/comments', getUserComments);
// Change "firebaseAuth" to "verifyFirebaseToken"
router.post("/sync", verifyFirebaseToken, syncUser);
export default router;