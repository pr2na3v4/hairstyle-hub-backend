// services/notificationService.js
import { Resend } from 'resend';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPersonalizedHairstyleAlert = async (hairstyle) => {
    try {
        // 1. Find matching users (Premium Logic)
        const users = await User.find({
            faceShape: hairstyle.suitableShape,
            "notifications.enabled": true,
            "notifications.weeklyCount": { $lt: 3 }
        });

        const emailTasks = users.map(async (user) => {
            const { data, error } = await resend.emails.send({
                from: 'HairstylesHub <notifications@hairstyleshub.in>',
                to: [user.email],
                subject: `Fresh look for your ${user.faceShape} face!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #333;">New Style Just Dropped ⚡</h2>
                        <p>Hey there, we found a perfect match for your <strong>${user.faceShape}</strong> face shape.</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <img src="${hairstyle.imageUrl}" alt="${hairstyle.name}" style="width: 100%; max-width: 300px; border-radius: 8px;" />
                            <h3 style="margin-top: 15px;">${hairstyle.name}</h3>
                        </div>
                        <p style="color: #666;">This style is specifically curated to enhance your features. Want to see more?</p>
                        <a href="https://hairstyleshub.in/styles/${hairstyle._id}" 
                           style="display: inline-block; background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                           View Details
                        </a>
                        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            You're receiving this because you scanned your face on HairstylesHub.in. 
                            <a href="https://hairstyleshub.in/account/settings" style="color: #999;">Unsubscribe</a>
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error(`Error sending to ${user.email}:`, error);
            } else {
                // Update frequency control
                user.notifications.weeklyCount += 1;
                user.notifications.lastNotified = new Date();
                await user.save();
            }
        });

        await Promise.all(emailTasks);
        return { success: true, count: users.length };

    } catch (err) {
        console.error("Notification Service Failure:", err);
    }
};