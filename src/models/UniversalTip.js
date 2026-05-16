import mongoose from 'mongoose';

const universalTipSchema = new mongoose.Schema({
  categoryType: { 
    type: String, 
    required: true, 
    enum: ['length', 'faceShape', 'hairType'] 
  },
  value: { type: String, required: true, unique: true },
  tips: { type: [String], required: true }
}, { timestamps: true });

export default mongoose.models.UniversalTip || mongoose.model('UniversalTip', universalTipSchema);