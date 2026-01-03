import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID
        required: true,
        index: true
    },
    haircutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Haircut',
        required: true
    }
}, { timestamps: true });

// This is CRITICAL: It stops a user from liking the same thing twice
likeSchema.index({ userId: 1, haircutId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;