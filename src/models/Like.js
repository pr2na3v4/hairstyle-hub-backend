import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    haircutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Haircut' },
    userId: String
});

const Like = mongoose.model("Like", likeSchema);
export default Like;