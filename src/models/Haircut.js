import mongoose from 'mongoose';

const haircutSchema = new mongoose.Schema({
    // Main Grouping (e.g., Textured Pixie)
    haircutType: { 
        type: String, 
        required: true, 
        trim: true 
    },
    // Specific Variant Name (e.g., Classic Textured Pixie)
    name: { 
        type: String, 
        required: true, 
        trim: true,
        unique: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    
    // 1st Column: Face Shapes
    faceShape: { 
        type: [String], 
        enum: ['Oval', 'Square', 'Round', 'Diamond', 'Heart'],
        default: [] 
    }, 

    // 2nd Column: Hair Length
    hairLength: { 
        type: String, 
        enum: ['Short', 'Medium', 'Long'],
        default: 'Medium',
        required: true
    },

    // Extra Details & Metadata
    tags: { type: [String], default: [] },
    isTrending: { type: Boolean, default: false },
    description: String,
    style: String, 
    likesCount: { type: Number, default: 0 }
}, { 
    timestamps: true 
});

// Indexes for super fast searching
haircutSchema.index({ faceShape: 1, hairLength: 1, haircutType: 1 });
haircutSchema.index({ name: 'text', tags: 'text' });

const Haircut = mongoose.model('Haircut', haircutSchema);
export default Haircut;