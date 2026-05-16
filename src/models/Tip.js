import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  // Added 'haircutType' into the enum validation list below
  categoryType: { 
    type: String, 
    required: true, 
    enum: ['length', 'faceShape', 'hairType', 'haircutType'] 
  },
  // Holds values like 'Short', 'Oval', 'Wavy', or specific haircut names like 'Textured Mohawk'
  value: { 
    type: String, 
    required: true
  },
  // The array of 5 rules/tips
  tips: { 
    type: [String], 
    required: true 
  }
}, { timestamps: true });

// Keeps the compound index intact so type + value pairs are unique together
tipSchema.index({ categoryType: 1, value: 1 }, { unique: true });

const Tip = mongoose.models.Tip || mongoose.model('Tip', tipSchema);
export default Tip;