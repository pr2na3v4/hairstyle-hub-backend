// test-email.js
import { Resend } from 'resend';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import mongoose from 'mongoose';
// Load your API Key
dotenv.config();

const resend = new Resend("re_CkAuK1m4_JFVEabJXvGWwc44reVvsFw4e");

const sendLaunchAnnouncement = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        // Ensure your MONGO_URI is in your .env file
        await mongoose.connect("mongodb+srv://pranavkashid08_db_user:JwmbHPfr9wiJPyNs@hairstylehub.zlxblsj.mongodb.net/hairstylehub");
        console.log("✅ Database Connected.");

        console.log("📢 Fetching users...");
        
        // --- TESTING MODE ---
        // Change this to find ONLY your email first to verify the design
        const users = await User.find({ email: 'pranavkashid08@gmail.com' }); 
        // --------------------

        if (users.length === 0) {
            console.log("⚠️ No users found matching the criteria.");
            return;
        }

        console.log(`Found ${users.length} user(s). Sending emails...`);

        const emailTasks = users.map(async (user) => {
            try {
                const { data, error } = await resend.emails.send({
                    from: 'HairstylesHub <updates@hairstyleshub.in>',
                    to: [user.email],
                    subject: 'Unlock Your Perfect Look with AI 🤖✨',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #000; padding: 30px; border-radius: 20px;">
                            <h1 style="text-align: center; color: #000;">Personalization is Live!</h1>
                            <p>Hi there, ${user.name}!</p>
                            <p>We've just upgraded <strong>HairstylesHub</strong> with a powerful AI engine. No more guessing which haircut suits you best.</p>
                            
                            <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                                <h3 style="margin-bottom:10px;">Step 1: Scan Your Face</h3>
                                <p>Our AI analyzes 468 landmarks to find your exact shape.</p>
                                <h3 style="margin-top:20px; margin-bottom:10px;">Step 2: Get Personalized Styles</h3>
                                <p>Instantly see hairstyles curated for YOUR unique face shape.</p>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://hairstyleshub.in/face-scan" 
                                   style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                                   Start Your AI Scan Now
                                </a>
                            </div>

                            <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
                                Once you scan your face, we'll keep you updated whenever new styles for your specific shape are added!
                            </p>
                            
                            <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
                            <p style="text-align: center; font-size: 12px; color: #999;">© 2026 HairstylesHub.in | The Future of Grooming</p>
                        </div>
                    `
                });

                if (error) console.error(`❌ Error for ${user.email}:`, error);
                else console.log(`✅ Sent to ${user.email}`);

            } catch (err) {
                console.error(`💥 Failed to send to ${user.email}:`, err);
            }
        });

        await Promise.all(emailTasks);
        console.log("🏁 All tasks complete.");

    } catch (error) {
        console.error("❌ Process failed:", error);
    } finally {
        // Close the connection so the script ends properly
        mongoose.connection.close();
    }
};

sendLaunchAnnouncement();