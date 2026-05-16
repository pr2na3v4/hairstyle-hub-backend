import Tip from '../models/Tip.js';

// @desc    Get tips by category type and value
// @route   GET /api/tips
// @access  Public
export const getTips = async (req, res) => {
  try {
    const { categoryType, value } = req.query;

    // Validation: Ensure both query parameters are provided
    if (!categoryType || !value) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide both 'categoryType' and 'value' query parameters." 
      });
    }

    // Query the database using our compound index structure
    const tipData = await Tip.findOne({ 
      categoryType: categoryType, 
      value: value 
    });

    // If no specific match is found, return a friendly fallback message
    if (!tipData) {
      return res.status(404).json({
        success: false,
        message: `No tips found for ${categoryType}: '${value}'.`,
        fallbackTips: [
          "Wash your hair regularly with a shampoo suited for your scalp type.",
          "Keep your hair hydrated by using a lightweight conditioner.",
          "Avoid using high heat settings when blow-drying your hair.",
          "Consult with a professional stylist before making major style changes.",
          "Schedule regular maintenance trims to keep your ends healthy."
        ]
      });
    }

    // Return the matching tips array
    return res.status(200).json({
      success: true,
      categoryType: tipData.categoryType,
      value: tipData.value,
      tips: tipData.tips
    });

  } catch (error) {
    console.error("❌ Error in getTips controller:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while retrieving hair tips." 
    });
  }
};