// utils/cronJobs.js
const cron = require('node-cron');
const User = require('../models/User');

// Run every Monday at midnight
cron.schedule('0 0 * * 1', async () => {
    await User.updateMany({}, { "notifications.weeklyCount": 0 });
    console.log("Weekly notification counts reset.");
});