import mongoose from 'mongoose';

const haircutSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    
    // 1st Column: Face Shapes (Multi-select sathi Array)
    faceShape: { 
        type: [String], 
        enum: ['Oval', 'Square', 'Round', 'Diamond', 'Heart'], // Flowchart nusar
        default: [] 
    }, 

    // 2nd Column: Hair Length (Dropdown sathi String)
    hairLength: { 
        type: String, 
        enum: ['Short', 'Medium', 'Long'], // Flowchart nusar fixed values
        default: 'Medium',
        required: true
    },

    // 3rd Column: Extra Details
    tags: { type: [String], default: [] },
    isTrending: { type: Boolean, default: false },
    
    // Additional info (preserved from your code)
    hairType: { type: [String], default: [] }, 
    description: String,
    style: String,
    likesCount: { type: Number, default: 0 }
}, { 
    timestamps: true 
});

// Performance sathi indexes
haircutSchema.index({ faceShape: 1, hairLength: 1 });
haircutSchema.index({ name: 'text', tags: 'text' });

const Haircut = mongoose.model('Haircut', haircutSchema);
export default Haircut;