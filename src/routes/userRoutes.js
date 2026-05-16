import express from 'express';
import { 
    getProfile, 
    getUserLikes, 
    getUserComments, 
    syncUser
} from '../controllers/userController.js';
import verifyFirebaseToken from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// ─── MIDDLEWARE INTERCEPTOR LAYER ───
// Applying this globally locks down ALL routes listed below it.
router.use(verifyFirebaseToken);

// ─── PROTECTED USER PROFILE ROUTES ───
router.get('/me', getProfile);
router.get('/me/likes', getUserLikes);
router.get('/me/comments', getUserComments);

// CLEANED: Removed duplicate verifyFirebaseToken invocation
router.post("/sync", syncUser);

// SECURED: Moved inside auth boundaries & streamlined data capture
router.put('/update-face-shape', async (req, res) => {
    const { faceShape } = req.body;
    
    // Grabs securely parsed email attached from your verifyFirebaseToken middleware
    // Adjust 'req.user?.email' depending on exactly how your middleware binds the decoded token data.
    const email = req.user?.email; 

    if (!email) {
        return res.status(401).json({ error: "Unauthorized: Active token session email not found." });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { faceShape },
            { new: true, upsert: true } // Creates profile if it doesn't exist yet
        );
        res.status(200).json({ message: "Profile personalized successfully!", user });
    } catch (error) {
        console.error("❌ Error updating face shape:", error);
        res.status(500).json({ error: "Failed to update profile features." });
    }
});

export default router;