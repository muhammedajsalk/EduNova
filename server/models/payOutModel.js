const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    paymentMethodSnapshot: {
        methodType: String,
        accountHolderName: String,
        accountNumber: String,
        bankName: String,
        upiId: String,
    },
    transactionId: {
      type: String,
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    notes: {
        type: String
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const PayoutModel = mongoose.model("Payout", payoutSchema);
module.exports = PayoutModel;