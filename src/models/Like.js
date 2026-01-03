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

// Ensure a user can only like a haircut once at the DB level
likeSchema.index({ userId: 1, haircutId: 1 }, { unique: true });

// ==========================================
// MIDDLEWARE: INCREMENT COUNTER
// ==========================================
likeSchema.post('save', async function (doc, next) {
    try {
        // We use $inc for atomicity. No need to "find" the haircut first.
        await mongoose.model('Haircut').updateOne(
            { _id: doc.haircutId },
            { $inc: { likesCount: 1 } }
        );
    } catch (err) {
        console.error(`Error incrementing likesCount for ${doc.haircutId}:`, err);
    }
    next();
});

// ==========================================
// MIDDLEWARE: DECREMENT COUNTER
// ==========================================
// Note: post('findOneAndDelete') captures calls like Like.findByIdAndDelete() 
// or Like.findOneAndDelete()
likeSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        try {
            await mongoose.model('Haircut').updateOne(
                { 
                    _id: doc.haircutId, 
                    likesCount: { $gt: 0 } // Safety: Never allow count to go negative
                },
                { $inc: { likesCount: -1 } }
            );
        } catch (err) {
            console.error(`Error decrementing likesCount for ${doc.haircutId}:`, err);
        }
    }
    next();
});

const Like = mongoose.model('Like', likeSchema);
export default Like;