// server/cron/subscriptionCron.js
const cron = require("node-cron");
const subscriptionModel = require("../models/subscriptionModel");

const startSubscriptionCleanupJob = () => {
  // Schedule to run every day at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    const now = new Date();

    try {
      const result = await subscriptionModel.updateMany(
        {
          endDate: { $lt: now },
          isActive: true
        },
        { $set: { isActive: false } }
      );

      console.log(`[Cron Job] Expired subscriptions updated: ${result.modifiedCount}`);
    } catch (err) {
      console.error("[Cron Job] Subscription cleanup error:", err);
    }
  });

  console.log("✅ Subscription cleanup cron job started (runs daily at 00:00)");
};

module.exports = startSubscriptionCleanupJob;
