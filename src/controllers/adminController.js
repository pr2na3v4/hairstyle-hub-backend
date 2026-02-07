import Haircut from '../models/Haircut.js';

// 1. Navin Haircut Add Karne
export const addHaircutViaLink = async (req, res) => {
    try {
        const { name, imageUrl, faceShape, hairLength, tags, isTrending, style, description } = req.body;

        // 1. Basic Validation
        if (!name || !imageUrl || !hairLength) {
            return res.status(400).json({ message: "Name, Image URL, and Hair Length are mandatory!" });
        }

        // 2. Duplicate Check: सेम नावाचा हेअरकट आधीच आहे का?
        const existingHaircut = await Haircut.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }); 
        // i flag मुळे 'Buzz Cut' आणि 'buzz cut' दोन्ही सेम मानले जातील.
        
        if (existingHaircut) {
            return res.status(400).json({ message: "हा हेअरकट आधीच डेटाबेसमध्ये आहे!" });
        }

        // 3. Tags Processing: String ला Array मध्ये रूपांतरित करणे
        let processedTags = [];
        if (tags && typeof tags === 'string') {
            processedTags = tags.split(',').map(t => t.trim()).filter(t => t !== "");
        } else if (Array.isArray(tags)) {
            processedTags = tags;
        }

        const newHaircut = new Haircut({
            haircutType,
            name,
            imageUrl,
            faceShape: Array.isArray(faceShape) ? faceShape : [],
            hairLength,
            tags: processedTags,
            isTrending: isTrending === true || isTrending === 'true',
            style,
            description
        });

        const savedHaircut = await newHaircut.save();
        res.status(201).json({ message: "Style successfully add झाली!", data: savedHaircut });

    } catch (error) {
        res.status(500).json({ message: "Server Error: स्टाईल ॲड करता आली नाही.", error: error.message });
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