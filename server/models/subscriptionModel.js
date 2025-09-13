const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    planType: {
      type: String,
      enum: ["monthly", "yearly", "custom"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    notes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notificationSent:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

subscriptionSchema.methods.isValid = function () {
  return this.isActive && new Date() <= this.endDate;
};

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);


module.exports=subscriptionModel