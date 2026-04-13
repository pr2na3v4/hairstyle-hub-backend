import FaceAnalysis from '../models/FaceAnalysis.js';

const saveFaceData = async (req, res) => {
  try {
    const {
      detected_shape,
      confidence,
      lw_ratio,
      fc_ratio,
      jc_ratio,
      fj_ratio,
    } = req.body;

    const analysisEntry = new FaceAnalysis({
      detected_shape,
      confidence,
      lw_ratio,
      fc_ratio,
      jc_ratio,
      fj_ratio,
      user_consent: true,
    });

    await analysisEntry.save();

    res.status(201).json({
      status: "success",
      message: "Anonymized metrics stored for AI improvement.",
    });
  } catch (error) {
    console.error("Analytics Storage Error:", error);
    res.status(500).json({ error: "Internal server error during data collection." });
  }
};

export default {
  saveFaceData
};