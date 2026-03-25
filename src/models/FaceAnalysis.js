import mongoose from 'mongoose';
const FaceAnalysisSchema = new mongoose.Schema({
  detected_shape: { 
    type: String, 
    required: true,
    index: true // Indexed for faster analytics queries
  },
  confidence: { type: Number, required: true },
  
  // Geometric Ratios (The "AI DNA")
  lw_ratio: { type: Number, required: true }, // Length to Width
  fc_ratio: { type: Number, required: true }, // Forehead to Cheek
  jc_ratio: { type: Number, required: true }, // Jaw to Cheek
  fj_ratio: { type: Number, required: true }, // Forehead to Jaw
  
  user_consent: { type: Boolean, default: false },
  version: { type: String, default: "1.0.0" }, // Helps track AI model updates
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('FaceAnalysis', FaceAnalysisSchema);