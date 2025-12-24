import User from "../models/User.js";

export const syncUser = async (req, res) => {
  try {
    // Extract info from the decoded token attached by middleware
    const { uid, name, email, picture } = req.user;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        firebaseUid: uid,
        name: name || "New User",
        email: email,
        photo: picture || ""
      });
      console.log(`✅ New user synced to MongoDB: ${email}`);
    } else {
      console.log(`👤 Existing user authenticated: ${email}`);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Error syncing user with database" });
  }
};