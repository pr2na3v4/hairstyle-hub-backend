import FaceAnalysis from '../models/FaceAnalysis.js';
import User from '../models/User.js'; // Import User to link the data

const saveFaceData = async (req, res) => {
  try {
    const {
      userId,          // <-- New: Passed from frontend (Redux/Context/LocalStorage)
      detected_shape,
      confidence,
      lw_ratio,
      fc_ratio,
      jc_ratio,
      fj_ratio,
    } = req.body;

    // 1. Store the AI Metrics (Keep your existing data collection)
    const analysisEntry = new FaceAnalysis({
      userId,          // Link the analysis to the user ID
      detected_shape,
      confidence,
      lw_ratio,
      fc_ratio,
      jc_ratio,
      fj_ratio,
      user_consent: true,
    });

    await analysisEntry.save();

    // 2. The "Premium" Move: Update the User Profile
    // This allows the notification system to target them later
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        faceShape: detected_shape,
        "notifications.enabled": true // Ensure they are opt-in for matches
      });
    }

    res.status(201).json({
      status: "success",
      message: `Profile updated with ${detected_shape} face shape. Notifications active.`,
      detected_shape
    });

  } catch (error) {
    console.error("Analytics Storage Error:", error);
    res.status(500).json({ error: "Internal server error during data collection." });
  }
};

export default {
  saveFaceData
};