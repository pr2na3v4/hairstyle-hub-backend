// src/controllers/haircutController.js
import Haircut from "../models/Haircut.js";

// ---------------- Get all haircuts ----------------
export const getAllHaircuts = async (req, res) => {
  try {
    const haircuts = await Haircut.find();
    res.json(haircuts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get single haircut ----------------
export const getHaircutById = async (req, res) => {
  try {
    const haircut = await Haircut.findById(req.params.id);
    if (!haircut) return res.status(404).json({ message: "Not found" });

    res.json(haircut);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Create haircut ----------------
export const createHaircut = async (req, res) => {
  try {
    const newHaircut = await Haircut.create(req.body);
    res.status(201).json(newHaircut);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- Update haircut ----------------
// This is your function to edit a haircut
export const updateHaircut = async (req, res) => {
    try {
        const { id } = req.params;      // The ID of the haircut
        const { name } = req.body;    // The NEW name you typed in

        // 1. Update the Haircut name first
        const updatedHaircut = await Haircut.findByIdAndUpdate(id, { name }, { new: true });

        // 2. NOW: Tell all comments to change the name too!
        // This says: "Find every comment with this haircutId and change its haircutName"
        await Comment.updateMany(
            { haircutId: id }, 
            { haircutName: name } 
        );

        res.status(200).json({ message: "Updated everything successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// ---------------- Delete haircut ----------------
export const deleteHaircut = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Delete the Haircut
        await Haircut.findByIdAndDelete(id);

        // 2. NOW: Delete all comments that belonged to that haircut
        // This says: "Find every comment that has this haircutId and remove it"
        await Comment.deleteMany({ haircutId: id });

        // 3. (Optional) Delete all "Likes" for that haircut too
        await Like.deleteMany({ haircutId: id });

        res.status(200).json({ message: "Haircut and all related data deleted!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting haircut" });
    }
};
