import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Must be firebaseUid
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);