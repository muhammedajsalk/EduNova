const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["success", "error", "warning", "info"],
      default: "info",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "auth_login_failed",
        "instructor_attempt_success",
        "instructor_attempt_failed",
        "course_new",
        "mentorship_new",
        "mentorship_purchased",
        "mentorship_not_attended_user",
        "mentorship_not_attended_instructor",
        "mentorship_cancelled",
        "mentorship_reminder",
        "subscription_purchased",
        "subscription_expiry_reminder",
        "subscription_ended",
        "course_enrolled",
        "message",
        "course_application_accepted",
        "course_application_rejected",
        "student_enrolled_message",
        "watchtime_milestone",
        "course_liked",
        "system_health",
        "course_verification",
        "instructor_application_verification",
      ],
      default: "system_health",
    },

    icon: { type: String },
    read: { type: Boolean, default: false },

    metadata: { type: mongoose.Schema.Types.Mixed },
    archived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const categoryIconMap = {
  auth_login_failed: "XCircle",
  instructor_attempt_success: "CheckCircle",
  instructor_attempt_failed: "XCircle",
  course_new: "ShoppingBag",
  mentorship_new: "User",
  mentorship_purchased: "ShoppingBag",
  mentorship_not_attended_user: "AlertCircle",
  mentorship_not_attended_instructor: "AlertCircle",
  mentorship_cancelled: "XCircle",
  mentorship_reminder: "Calendar",
  subscription_purchased: "CheckCircle",
  subscription_expiry_reminder: "AlertCircle",
  subscription_ended: "XCircle",
  course_enrolled: "GraduationCap",
  message: "MessageSquare",
  course_application_accepted: "CheckCircle",
  course_application_rejected: "XCircle",
  student_enrolled_message: "Mail",
  watchtime_milestone: "Clock",
  course_liked: "Heart",
  system_health: "Settings",
  course_verification: "Info",
  instructor_application_verification: "UserCheck",
};

notificationSchema.pre("save", function (next) {
  if (!this.icon && this.category) {
    this.icon = categoryIconMap[this.category] || "Bell";
  }
  next();
});

const notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;
