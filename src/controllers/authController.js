import admin from '../config/firebase-config.js';
import User from '../models/User.js';

export const googleAuth = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 1. Verify the token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decodedToken;

        // 2. Find user in MongoDB or create if they don't exist
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                name: name || 'Anonymous',
                email: email,
                photo: picture
            });
            console.log(`✨ New user created: ${email}`);
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};