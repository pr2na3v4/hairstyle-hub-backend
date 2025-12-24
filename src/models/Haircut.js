import mongoose from 'mongoose';

const haircutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    hairType: [String],        // Changed to Array of Strings
    faceShape: [String],       // Changed to Array of Strings
    hairLength: String,        // Removed strict enum/required
    description: String,       // Removed required: true
    style: String,
    tags: [String],
    isTrending: Boolean,
    likesCount: { type: Number, default: 0 }
}, { 
    timestamps: true // This automatically handles createdAt and updatedAt
});

const Haircut = mongoose.model('Haircut', haircutSchema);
export default Haircut;