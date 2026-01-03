import Like from "../models/Like.js";
import Haircut from "../models/Haircut.js";

export const toggleLike = async (req, res) => {
    try {
        const haircutId = req.params.id;
        
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = req.user.uid;

        // FIX 1: Use .lean() to make the check faster and cleaner
        const existingLike = await Like.findOne({ haircutId, userId }).lean();

        if (existingLike) {
            // --- UNLIKE ---
            // FIX 2: Delete by the exact ID we found
            await Like.deleteOne({ _id: existingLike._id });
            
            const updated = await Haircut.findByIdAndUpdate(
                haircutId,
                { $inc: { likesCount: -1 } },
                { new: true, runValidators: true }
            );

            // Safety: Don't let count go below 0
            if (updated && updated.likesCount < 0) {
                updated.likesCount = 0;
                await updated.save();
            }

            return res.json({ liked: false, likesCount: updated?.likesCount || 0 });
        } else {
            // --- LIKE ---
            await Like.create({ haircutId, userId });
            
            const updated = await Haircut.findByIdAndUpdate(
                haircutId,
                { $inc: { likesCount: 1 } },
                { new: true, runValidators: true }
            );

            return res.json({ liked: true, likesCount: updated?.likesCount || 0 });
        }
    } catch (error) {
        console.error("LIKE SYSTEM ERROR:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getLikeStatus = async (req, res) => {
    try {
        const haircutId = req.params.id;
        // Make sure we get the userId safely
        const userId = req.user?.uid || null;

        // Fetch haircut and like status at the same time
        const [haircut, like] = await Promise.all([
            Haircut.findById(haircutId).select('likesCount').lean(),
            userId ? Like.findOne({ haircutId, userId }).lean() : null
        ]);

        res.json({
            likesCount: haircut ? (haircut.likesCount || 0) : 0,
            hasLiked: !!like
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching status" });
    }
};