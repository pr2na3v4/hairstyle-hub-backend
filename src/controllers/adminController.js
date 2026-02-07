import Haircut from '../models/Haircut.js';

// 1. Navin Haircut Add Karne
export const addHaircutViaLink = async (req, res) => {
    try {
        const { name, imageUrl, faceShape, hairLength, tags, isTrending, style, description } = req.body;

        // Basic Validation
        if (!name || !imageUrl || !hairLength) {
            return res.status(400).json({ message: "Name, Image URL, and Hair Length are mandatory!" });
        }

        const newHaircut = new Haircut({
            name,
            imageUrl,
            faceShape: Array.isArray(faceShape) ? faceShape : [],
            hairLength,
            tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
            isTrending: isTrending === true || isTrending === 'true',
            style,
            description
        });

        const savedHaircut = await newHaircut.save();
        res.status(201).json({ message: "Style added successfully!", data: savedHaircut });
    } catch (error) {
        res.status(500).json({ message: "Error adding style", error: error.message });
    }
};

// 2. Sagle Haircuts Fetch Karne (Manage Page sathi)
export const getAllStyles = async (req, res) => {
    try {
        const styles = await Haircut.find().sort({ createdAt: -1 });
        res.status(200).json(styles);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch styles", error: error.message });
    }
};

// 3. Existing Style Update Karne (Edit logic)
export const updateHaircut = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedStyle = await Haircut.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedStyle) {
            return res.status(404).json({ message: "Style not found!" });
        }

        res.status(200).json({ message: "Style updated successfully!", data: updatedStyle });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// 4. Style Kaymchi Delete Karne
export const deleteHaircut = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStyle = await Haircut.findByIdAndDelete(id);

        if (!deletedStyle) {
            return res.status(404).json({ message: "Style already deleted or not found!" });
        }

        res.status(200).json({ message: "Style deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};