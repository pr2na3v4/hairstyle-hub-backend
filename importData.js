import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Haircut from './src/models/Haircut.js';
import dotenv from 'dotenv';
const mongoURI = "MONGO_URI" in process.env ? process.env.MONGO_URI : "mongodb://localhost:27017/haircutapp";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
// ... (keep your imports and __dirname fix as before)

const importData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB...");

        const jsonPath = path.join(__dirname, '../frontend/data/haircuts.json');
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        const formattedData = data.map(item => {
            return {
                ...item,
                // Fix the ID
                _id: item._id?.$oid ? new mongoose.Types.ObjectId(item._id.$oid) : new mongoose.Types.ObjectId(),
                
                // Initialize likes
                likesCount: 0,

                // Fix Dates: Strip the $date wrapper and convert to real JS Dates
                createdAt: item.createdAt?.$date ? new Date(item.createdAt.$date) : new Date(),
                updatedAt: item.updatedAt?.$date ? new Date(item.updatedAt.$date) : new Date(),

                // Add a default description so it doesn't fail validation
                description: item.description || "A stylish modern haircut.",

                // Ensure faceShape and hairType are arrays (defensive coding)
                faceShape: Array.isArray(item.faceShape) ? item.faceShape : [item.faceShape],
                hairType: Array.isArray(item.hairType) ? item.hairType : [item.hairType]
            };
        });

        await Haircut.deleteMany({});
        await Haircut.insertMany(formattedData);

        console.log("Success! Data imported and cleaned.");
        process.exit();
    } catch (err) {
        console.error("Import failed:", err);
        process.exit(1);
    }
};

importData();