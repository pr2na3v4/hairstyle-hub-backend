// models/Tip.js — replace both files with this
import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  categoryType: {
    type: String,
    required: true,
    enum: ['length', 'style', 'haircutType', 'hairType', 'faceShape', 'tag', 'universal'],
  },
  value: {
    type: String,
    required: true,
  },
  tips: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

tipSchema.index({ categoryType: 1, value: 1 }, { unique: true });

export default mongoose.models.Tip || mongoose.model('Tip', tipSchema);