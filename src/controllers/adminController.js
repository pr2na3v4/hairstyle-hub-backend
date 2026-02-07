import Haircut from '../models/Haircut.js';

export const addHaircutViaLink = async (req, res) => {
    try {
        const { name, imageUrl, faceShape, hairLength, tags, isTrending } = req.body;

        // Simple Validation
        if (!name || !imageUrl) {
            return res.status(400).json({ message: "Nav ani Image Link garjechi aahe!" });
        }

        const newHaircut = new Haircut({
            name,
            imageUrl, // browser madhli direct link
            faceShape, 
            hairLength,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            isTrending: isTrending === 'true' || isTrending === true
        });

        await newHaircut.save();
        res.status(201).json({ message: "Haircut successfully add jhala!", data: newHaircut });
    } catch (error) {
        res.status(500).json({ message: "Error aala bhava!", error: error.message });
    }
};