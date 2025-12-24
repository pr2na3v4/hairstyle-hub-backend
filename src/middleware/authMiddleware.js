import admin from 'firebase-admin';
import User from '../models/User.js';

// 1. Optional Token Verification (For public pages that show "Liked" status)
export const verifyTokenOptional = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Find user in DB so req.user is always a Mongoose Document
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        req.user = user || null;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

// 2. Strict Token Verification (For Liking/Posting)
const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("Auth Error: Missing or malformed header");
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Find or Create User in MongoDB
        let user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
            console.log("🛠 Syncing new user to MongoDB...");
            user = await User.create({
                firebaseUid: decodedToken.uid,
                name: decodedToken.name || "Anonymous",
                email: decodedToken.email || "",
                photo: decodedToken.picture || ""
            });
        }

        // Attach the MongoDB user document to the request
        req.user = user; 
        
        // IMPORTANT: Also attach the raw firebase UID for easier access in controllers
        req.user.uid = decodedToken.uid; 

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.code, error.message);
        const status = error.code === 'auth/id-token-expired' ? 401 : 403;
        res.status(status).json({ error: 'Authentication failed', detail: error.code });
    }
};

export default verifyFirebaseToken;