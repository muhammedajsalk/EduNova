const razorpay = require("../../confiq/razropay")
const paymentModel = require("../../models/paymentModel")
const dontenv=require('dotenv');
const subscriptionModel = require("../../models/subscriptionModel");

const createpayment = async (req, res) => {
   try {
    const {amount,courseId,planType} = req.body;
    const userId = req?.user?.id;

    const receiptId = `receipt_${Math.random().toString(36).substring(2, 10)}`;

    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: receiptId,
      notes: {
        userId: String(userId),
        courseId,
        planType
      },
    };

    const order = await razorpay.orders.create(options);

    const payment = await paymentModel.create({
      userId,
      razorpay_order_id: order.id,
      amount,
      currency,
      receipt: order.receipt,
      notes: order.notes,
      status: "created",
    });

    res.status(201).json({
      success: true,
      order,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("Error in createPayment:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

module.exports=createpayment