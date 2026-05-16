import Tip from '../models/Tip.js';

// @desc    Get dynamic, balanced smart tips based on haircut attributes
// @route   GET /api/tips
// @access  Public
export const getTips = async (req, res) => {
  try {
    const {
      hairLength = '',
      style = '',
      haircutType = '',
      hairType = [],
      faceShape = [],
      tags = []
    } = req.query;

    // 1. Convert incoming query items uniformly to process clean match patterns
    const normalizedLength = String(hairLength).trim();
    const normalizedStyle = String(style).trim();
    const normalizedHaircutType = String(haircutType).trim();

    // Ensure array variations parsed from query strings are safely handled
    const forceArray = (item) => {
      if (!item) return [];
      return Array.isArray(item) ? item : [item];
    };

    const arrayHairTypes = forceArray(hairType);
    const arrayFaceShapes = forceArray(faceShape);
    const arrayTags = forceArray(tags);

    // 2. Construct conditions array for an optimized $or lookup matrix
    const queryConditions = [
      { categoryType: 'universal' } // Always pull fallback pool records
    ];

    if (normalizedLength) {
      queryConditions.push({ categoryType: 'length', value: new RegExp(`^${normalizedLength}$`, 'i') });
    }
    if (normalizedStyle) {
      queryConditions.push({ categoryType: 'style', value: new RegExp(normalizedStyle, 'i') });
    }
    if (normalizedHaircutType) {
      queryConditions.push({ categoryType: 'haircutType', value: new RegExp(`^${normalizedHaircutType}$`, 'i') });
    }
    if (arrayHairTypes.length > 0) {
      queryConditions.push({ categoryType: 'hairType', value: { $in: arrayHairTypes.map(val => new RegExp(`^${val}$`, 'i')) } });
    }
    if (arrayFaceShapes.length > 0) {
      queryConditions.push({ categoryType: 'faceShape', value: { $in: arrayFaceShapes.map(val => new RegExp(`^${val}$`, 'i')) } });
    }
    if (arrayTags.length > 0) {
      queryConditions.push({ categoryType: 'tag', value: { $in: arrayTags.map(val => new RegExp(`^${val}$`, 'i')) } });
    }

    // Pull targeted matching records alongside universal fallbacks from collection
    const matchedTipDocuments = await Tip.find({ $or: queryConditions });

    // 3. Unpack arrays into individual tip options and compute algorithmic scores
    let scoredTips = [];
    let universalPool = [];

    matchedTipDocuments.forEach(doc => {
      const type = doc.categoryType;

      if (type === 'universal') {
        doc.tips.forEach(tipText => {
          universalPool.push({ text: tipText, category: 'universal', score: 0 });
        });
        return;
      }

      // Assign weight priorities based on specificity metrics
      let weight = 0;
      if (type === 'style' || type === 'haircutType') weight = 3;
      if (type === 'hairType' || type === 'faceShape' || type === 'length') weight = 2;
      if (type === 'tag') weight = 1;

      doc.tips.forEach(tipText => {
        scoredTips.push({
          text: tipText,
          category: type,
          score: weight
        });
      });
    });

    // Sort matching tips by score tier descending, randomize matches at the same tier
    scoredTips.sort((a, b) => b.score - a.score || Math.random() - 0.5);

    // 4. Balance Phase: Limit the system to display a maximum of 2 tips per category type
    const categoryCounts = {};
    const balancedTips = [];
    const maxTargetCount = 5;

    for (const tip of scoredTips) {
      const cat = tip.category;
      categoryCounts[cat] = categoryCounts[cat] || 0;

      if (categoryCounts[cat] < 2) {
        balancedTips.push(tip);
        categoryCounts[cat]++;
      }
      if (balancedTips.length >= maxTargetCount) break;
    }

    // 5. Padding Phase: Inject items from the universal pool if we are under the target count
    if (balancedTips.length < maxTargetCount) {
      universalPool.sort(() => Math.random() - 0.5);
      
      while (balancedTips.length < maxTargetCount && universalPool.length > 0) {
        balancedTips.push(universalPool.pop());
      }
    }

    // Extract raw string text arrays cleanly for production delivery
    const payloadResult = balancedTips.slice(0, maxTargetCount).map(t => t.text);

    return res.status(200).json({
      success: true,
      count: payloadResult.length,
      tips: payloadResult
    });

  } catch (error) {
    console.error("❌ Error running smart tips algorithm matrix:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while executing smart matching calculations."
    });
  }
};