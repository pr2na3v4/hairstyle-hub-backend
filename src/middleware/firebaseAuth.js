import admin from "../config/firebase-config.js";
import User from "../models/User.js";

export const firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    // 1. Verify Google Token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. Sync with MongoDB
    // We look for 'firebaseUid' which matches your User Schema
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      console.log("🛠 USER SYNC: Creating new user in MongoDB for:", decodedToken.email);
      user = await User.create({
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || "Anonymous",
        email: decodedToken.email || "",
        photo: decodedToken.picture || ""
      });
    } else {
      console.log("✅ USER SYNC: Existing user found in MongoDB:", user.email);
    }

    // 3. Attach the FULL Mongoose Document to req.user
    // This makes req.user.firebaseUid available in your controllers
    req.user = user; 
    
    next();
  } catch (error) {
    console.error("❌ AUTH MIDDLEWARE ERROR:", error.message);
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

export default firebaseAuth;