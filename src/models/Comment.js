import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    haircutId: { type: mongoose.Schema.Types.ObjectId,
  ref: 'Haircut', required: true, index: true }, // Added index for faster searching
    text: { type: String, required: true },
    userName: String,
    userPhoto: String,
    userId: { type: String, required: true }, // Renamed to match controller
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;