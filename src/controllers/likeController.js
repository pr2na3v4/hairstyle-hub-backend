import Like from "../models/Like.js";
import Haircut from "../models/Haircut.js";

// Named Export: toggleLike
export const toggleLike = async (req, res) => {
    try {
        const haircutId = req.params.id;
        // Safety check: ensure user exists from verifyToken middleware
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = req.user.uid;

        // 1. Check if like exists
        const existingLike = await Like.findOne({ haircutId, userId });

        if (existingLike) {
            // UNLIKE
            await Like.deleteOne({ _id: existingLike._id });
            const updated = await Haircut.findByIdAndUpdate(
                haircutId,
                { $inc: { likesCount: -1 } },
                { new: true }
            );
            return res.json({ liked: false, likesCount: updated?.likesCount || 0 });
        } else {
            // LIKE
            await Like.create({ haircutId, userId });
            const updated = await Haircut.findByIdAndUpdate(
                haircutId,
                { $inc: { likesCount: 1 } },
                { new: true }
            );
            return res.json({ liked: true, likesCount: updated?.likesCount || 0 });
        }
    } catch (error) {
        console.error("LIKE SYSTEM ERROR:", error); // This shows in your terminal
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Named Export: getLikeStatus (This was missing!)
export const getLikeStatus = async (req, res) => {
    try {
        const haircutId = req.params.id;
        const userId = req.user ? req.user.uid : null;

        const haircut = await Haircut.findById(haircutId).select('likesCount');
        let hasLiked = false;

        if (userId) {
            const like = await Like.findOne({ haircutId, userId });
            hasLiked = !!like;
        }

        res.json({
            likesCount: haircut ? (haircut.likesCount || 0) : 0,
            hasLiked: hasLiked
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching status", error });
    }
};