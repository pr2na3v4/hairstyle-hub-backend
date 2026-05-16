import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Must be firebaseUid
  name: { type: String, required: true },
  photo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
    // The "Brain": linked to our AI output
    faceShape: { 
        type: String, 
        enum: ['Oval', 'Square', 'Round', 'Heart', 'Triangle', 'Diamond', 'Oblong', null],
        default: null 
    },
    savedHairstyles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hairstyle' }],
    
    // Notification Control (The "Premium" Feel)
    notifications: {
        enabled: { type: Boolean, default: true },
        weeklyCount: { type: Number, default: 0 }, // Reset this every week
        lastNotified: { type: Date }
    }

}, { timestamps: true });

export default mongoose.model("User", userSchema);