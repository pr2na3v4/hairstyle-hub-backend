import mongoose from 'mongoose';
import Like from './src/models/Like.js';
import Haircut from './src/models/Haircut.js';
import dotenv from 'dotenv';

dotenv.config();

const fixLikes = async () => {
    try {
        // 1. Connect to your Database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // 2. Get all haircuts
        const haircuts = await Haircut.find({});
        console.log(`Checking ${haircuts.length} haircuts...`);

        for (let haircut of haircuts) {
            // 3. Count how many REAL likes exist in the Likes collection for this haircut
            const realLikeCount = await Like.countDocuments({ haircutId: haircut._id });

            // 4. Update the haircut with the correct number
            await Haircut.findByIdAndUpdate(haircut._id, { 
                likesCount: realLikeCount 
            });

            console.log(`Updated "${haircut.name}": Set likes to ${realLikeCount}`);
        }

        console.log("✅ Database fixed successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error during cleanup:", error);
        process.exit(1);
    }
};

fixLikes();