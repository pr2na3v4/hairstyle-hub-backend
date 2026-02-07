import Like from "../models/Like.js";
import Haircut from "../models/Haircut.js";
import mongoose from "mongoose"; // 👈 He import karne garjeche aahe

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid;

        if (!userId) return res.status(401).json({ message: "User not authenticated" });

        // 💡 Convert String to proper ObjectId
        const hId = new mongoose.Types.ObjectId(id);

        const existingLike = await Like.findOne({ haircutId: hId, userId }).lean();

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            const updated = await Haircut.findByIdAndUpdate(id, { $inc: { likesCount: -1 } }, { new: true });
            return res.json({ liked: false, likesCount: Math.max(0, updated?.likesCount || 0) });
        } else {
            await Like.create({ haircutId: hId, userId });
            const updated = await Haircut.findByIdAndUpdate(id, { $inc: { likesCount: 1 } }, { new: true });
            return res.json({ liked: true, likesCount: updated?.likesCount || 0 });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getLikeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid || null;

        // 💡 1. String id la ObjectID madhe convert kara
        const hId = new mongoose.Types.ObjectId(id);

        const [haircut, like] = await Promise.all([
            Haircut.findById(id).select('likesCount').lean(),
            // 💡 2. Query madhe converted hId vapra
            userId ? Like.findOne({ haircutId: hId, userId: userId }).lean() : null
        ]);

        console.log("Found Like in DB:", like); // Backend console madhe check kara

        res.json({
            likesCount: haircut?.likesCount || 0,
            hasLiked: !!like // Jar 'like' object sapdla tar true hoil
        });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Error fetching status" });
    }
};