import express from 'express';
import { 
    getProfile, 
    getUserLikes, 
    getUserComments, 
    syncUser
} from '../controllers/userController.js';
import verifyFirebaseToken from '../middleware/authMiddleware.js';
const User = require('../models/User');

const router = express.Router();
router.put('/update-face-shape', async (req, res) => {
    const { email, faceShape } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { faceShape },
            { new: true, upsert: true } // Creates user if they don't exist
        );
        res.status(200).json({ message: "Profile personalized!", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile." });
    }
});

// This route is now protected. Only users with a valid Firebase token can sync.
router.use(verifyFirebaseToken);

router.get('/me', getProfile);
router.get('/me/likes', getUserLikes);
router.get('/me/comments', getUserComments);
// Change "firebaseAuth" to "verifyFirebaseToken"
router.post("/sync", verifyFirebaseToken, syncUser);
export default router;