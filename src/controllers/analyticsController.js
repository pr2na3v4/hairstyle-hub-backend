const FaceAnalysis = require('../models/FaceAnalysis');

exports.saveFaceData = async (req, res) => {
  try {
    const { 
      detected_shape, 
      confidence, 
      lw_ratio, 
      fc_ratio, 
      jc_ratio, 
      fj_ratio, 
      user_consent 
    } = req.body;

    // Strict Privacy Gate: If no consent, we don't even touch the DB
    if (!user_consent) {
      return res.status(202).json({ 
        message: "Data received but discarded due to lack of user consent." 
      });
    }

    const analysisEntry = new FaceAnalysis({
      detected_shape,
      confidence,
      lw_ratio,
      fc_ratio,
      jc_ratio,
      fj_ratio,
      user_consent
    });

    await analysisEntry.save();

    res.status(201).json({ 
      status: "success", 
      message: "Anonymized metrics stored for AI improvement." 
    });
  } catch (error) {
    console.error("Analytics Storage Error:", error);
    res.status(500).json({ error: "Internal server error during data collection." });
  }
};