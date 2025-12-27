import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Haircut from "../models/Haircut.js";

dotenv.config();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON manually (✅ Node-safe)
const dataPath = path.join(__dirname, "haircuts.json");
const haircuts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const seedHaircuts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Remove old data
    await Haircut.deleteMany();
    console.log("🧹 Old haircuts removed");

    // Clean & insert
    const cleaned = haircuts.map(h => ({
      name: h.name,
      imageUrl: h.imageUrl,
      hairType: h.hairType,
      faceShape: h.faceShape,
      hairLength: h.hairLength,
      style: h.style,
      tags: h.tags,
      isTrending: h.isTrending || false,
      likesCount: 0
    }));

    await Haircut.insertMany(cleaned);
    console.log("🌱 Haircuts seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedHaircuts();
