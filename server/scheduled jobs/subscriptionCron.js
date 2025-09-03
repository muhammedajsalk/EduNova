const cron = require("node-cron");
const subscriptionModel = require("../models/subscriptionModel");
const mentorshipModel = require("../models/mentorshipModel");
const videoSessionModel = require("../models/videoSessionModel");

const startSubscriptionCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    const now = new Date();

    try {
      const result = await subscriptionModel.updateMany(
        { endDate: { $lt: now }, isActive: true },
        { $set: { isActive: false } }
      );

      const mentorDate = await mentorshipModel.updateMany(
        { selectedDate: { $lt: now }, isActive: true },
        { $set: { isActive: false } }
      );

      const videoSession = await videoSessionModel.updateMany(
        { selectedTimes: { $lt: now }, isActive: true },
        { $set: { isActive: false } }
      )

      console.log(`[Cron Job] Expired subscriptions updated: ${result.modifiedCount}`);
      console.log(`[Cron Job] Expired mentorship updated: ${mentorDate.modifiedCount}`);
      console.log(`[Cron Job] Expired videosession updated: ${videoSession.modifiedCount}`);
    } catch (err) {
      console.error("[Cron Job] Subscription cleanup error:", err);
    }
  });

  console.log("✅ Subscription cleanup cron job started (runs every minute for testing)");
};

module.exports = startSubscriptionCleanupJob;
