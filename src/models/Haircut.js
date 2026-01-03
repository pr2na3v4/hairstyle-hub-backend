import mongoose from 'mongoose';

const haircutSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true  // Cleans up accidental spaces
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    
    // Using [] means it can hold multiple values (like "Round" and "Oval")
    hairType: { type: [String], default: [] }, 
    faceShape: { type: [String], default: [] }, 
    tags: { type: [String], default: [] },

    hairLength: { type: String, default: 'Medium' }, 
    description: String,
    style: String,
    
    // isTrending is like a switch: true (on) or false (off)
    isTrending: { type: Boolean, default: false },
    
    // This counts how many people liked it
    likesCount: { type: Number, default: 0 }
}, { 
    // This automatically adds the date the haircut was created
    timestamps: true 
});

// These lines below make your search bar and filters work super fast!
haircutSchema.index({ faceShape: 1, hairType: 1 });
haircutSchema.index({ name: 'text', tags: 'text' });

const Haircut = mongoose.model('Haircut', haircutSchema);
export default Haircut;