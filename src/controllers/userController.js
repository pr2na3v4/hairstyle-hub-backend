import User from "../models/User.js";
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
export const syncUser = async (req, res) => {
  try {
    // Extract info from the decoded token attached by middleware
    const { uid, name, email, picture } = req.user;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        firebaseUid: uid,
        name: name || "New User",
        email: email,
        photo: picture || ""
      });
      console.log(`✅ New user synced to MongoDB: ${email}`);
    } else {
      console.log(`👤 Existing user authenticated: ${email}`);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Error syncing user with database" });
  }
};

export const getProfile = async (req, res) => {
    try {
        // req.user.uid comes from verifyFirebaseToken middleware
        const user = await User.findOne({ firebaseUid: req.user.uid })
            .select('name email photo createdAt');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Get all haircuts liked by user
 * @route   GET /api/users/me/likes
 */
export const getUserLikes = async (req, res) => {
    try {
        // 1. Find all like documents for this user
        // 2. Populate the 'haircutId' field to get full Haircut objects
        const likedDocs = await Like.find({ userId: req.user.uid })
            .populate({
                path: 'haircutId',
                select: 'name imageUrl hairType hairLength' // Selective fields for performance
            })
            .lean();

        // Map to return an array of just the Haircut objects
        const likedHaircuts = likedDocs
            .filter(doc => doc.haircutId) // Filter out if a haircut was deleted
            .map(doc => doc.haircutId);

        res.status(200).json(likedHaircuts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Get all comments by user
 * @route   GET /api/users/me/comments
 */
export const getUserComments = async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.user.uid })
            .populate({
                path: 'haircutId',
                select: 'name' // Only need the name of the haircut for the UI
            })
            .sort({ createdAt: -1 }) // Newest first
            .lean();

        // Transform data to match requested format
        const formattedComments = comments.map(c => ({
            _id: c._id,
            text: c.text,
            createdAt: c.createdAt,
            haircutId: c.haircutId?._id,
            haircutName: c.haircutId?.name || "Deleted Style"
        }));

        res.status(200).json(formattedComments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};