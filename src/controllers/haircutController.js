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
export const updateHaircut = async (req, res) => {
  try {
    const updated = await Haircut.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- Delete haircut ----------------
export const deleteHaircut = async (req, res) => {
  try {
    const deleted = await Haircut.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Haircut deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
