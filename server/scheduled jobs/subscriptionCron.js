const cron = require("node-cron");
const subscriptionModel = require("../models/subscriptionModel");
const mentorshipModel = require("../models/mentorshipModel");
const videoSessionModel = require("../models/videoSessionModel");
const notificationModel = require("../models/notificationModel");

/**
 * Cleanup expired subscriptions, mentorships, and video sessions
 */
const subscriptionCleanupJob = async () => {
  const now = new Date();

  try {
    const subResult = await subscriptionModel.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } }
    );

    const mentorshipResult = await mentorshipModel.updateMany(
      { selectedDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } }
    );

    const expiredSessions = await videoSessionModel.find(
      { selectedTimes: { $lt: now }, isActive: true }
    ).select("_id userId instructorId selectedTimes");

    if (expiredSessions.length > 0) {
      await videoSessionModel.updateMany(
        { _id: { $in: expiredSessions.map((s) => s._id) } },
        { $set: { isActive: false, status: "canceled" } }
      );

      const notifications = expiredSessions.flatMap((session) => [
        {
          userId: session.userId,
          type: "warning",
          title: "Video Session Canceled",
          category:"mentorship_cancelled",
          message: `Your video session on ${new Date(
            session.selectedTimes
          ).toLocaleString()} has been canceled.`,
        },
        {
          userId: session.instructorId,
          type: "warning",
          category:"mentorship_cancelled",
          title: "Video Session Canceled",
          message: `Your scheduled session with user ${session.userId} was canceled.`,
        },
      ]);

      if (notifications.length > 0) {
        await notificationModel.insertMany(notifications);
      }

      console.log(`[Cron Job] Video sessions canceled: ${expiredSessions.length}`);
    }

    console.log(`[Cron Job] Subscriptions expired: ${subResult.modifiedCount}`);
    console.log(`[Cron Job] Mentorships expired: ${mentorshipResult.modifiedCount}`);
  } catch (err) {
    console.error("[Cron Job] Cleanup error:", err);
  }
};

/**
 * Send notification for all video sessions happening today
 */
const videoSessionTodayNotificationJob = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  try {
    const todaySessions = await videoSessionModel.find({
      isActive: true,
      selectedTimes: { $gte: startOfDay, $lte: endOfDay },
    }).select("_id userId instructorId selectedTimes notificationsSent");

    for (let session of todaySessions) {
      if (!Array.isArray(session.notificationsSent)) session.notificationsSent = [];

      const sessionDateStr = session.selectedTimes.toDateString();
      if (!session.notificationsSent.includes(sessionDateStr)) {
        const notifications = [
          {
            userId: session.userId,
            type: "info",
            category:"mentorship_reminder",
            title: "Video Session Today",
            message: `Your video session is scheduled today at ${session.selectedTimes.toLocaleTimeString()}.`,
          },
          {
            userId: session.instructorId,
            type: "info",
            category:"mentorship_reminder",
            title: "Video Session Today",
            message: `You have a video session today with user ${session.userId} at ${session.selectedTimes.toLocaleTimeString()}.`,
          },
        ];

        await notificationModel.insertMany(notifications);

        await videoSessionModel.updateOne(
          { _id: session._id },
          { $push: { notificationsSent: sessionDateStr } }
        );

        console.log(`[Cron Job] Notification sent for session ${session._id}`);
      }
    }
  } catch (err) {
    console.error("[Cron Job] Video session today notification error:", err);
  }
};

/**
 * Send notification 2 days before subscription ends
 */
const subscriptionEndingSoonNotificationJob = async () => {
  const now = new Date();

  const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  try {
    const subscriptionsEndingSoon = await subscriptionModel.find({
      isActive: true,
      endDate: {
        $gte: now,
        $lte: twoDaysLater,
      },
      notificationSent: { $ne: true },
    }).select("_id userId endDate notificationSent");

    console.log("Subscriptions found:", subscriptionsEndingSoon);

    for (let sub of subscriptionsEndingSoon) {
      await notificationModel.create({
        userId: sub.userId,
        type: "info",
        title: "Subscription Ending Soon",
        category: "subscription_expiry_reminder",
        message: `Your subscription will end on ${sub.endDate.toDateString()}. Renew it soon to avoid interruption.`,
      });

      await subscriptionModel.updateOne(
        { _id: sub._id },
        { $set: { notificationSent: true } }
      );

      console.log(`[Cron Job] Notification sent for user ${sub.userId}`);
    }
  } catch (err) {
    console.error("[Cron Job] Subscription ending soon notification error:", err);
  }
};


const subscriptionEndedNotificationJob = async () => {
  const now = new Date();

  try {
    const endedSubscriptions = await subscriptionModel.find({
      isActive: false,
      notificationEndedSent: { $ne: true },
    }).select("_id userId endDate notificationEndedSent");

    for (let sub of endedSubscriptions) {
      await notificationModel.create({
        userId: sub.userId,
        type: "info",
        category: "subscription_ended",
        title: "Subscription Ended",
        message: `Your subscription ended on ${sub.endDate.toDateString()}. Renew to continue accessing services.`,
      });

      await subscriptionModel.updateOne(
        { _id: sub._id },
        { $set: { notificationEndedSent: true } }
      );

      console.log(`[Cron Job] Subscription ended notification sent for user ${sub.userId}`);
    }
  } catch (err) {
    console.error("[Cron Job] Subscription ended notification error:", err);
  }
};



/**
 * Start all cron jobs
 */
const startCronJobs = () => {
  cron.schedule("0 8,12,16,20,0 * * *", subscriptionCleanupJob, {
    timezone: "Asia/Kolkata"
  });

  cron.schedule("0 8,12,16,20,0 * * *", videoSessionTodayNotificationJob, {
    timezone: "Asia/Kolkata"
  });

  cron.schedule("0 0 * * *", subscriptionEndingSoonNotificationJob, {
    timezone: "Asia/Kolkata"
  });
  
  cron.schedule("0 8 * * *", subscriptionEndedNotificationJob, {
    timezone: "Asia/Kolkata"
  });

  console.log(
    "✅ Cron jobs started: cleanup, video session today notification, subscription ending soon notification"
  );
};

module.exports = startCronJobs;
