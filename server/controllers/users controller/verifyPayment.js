const crypto = require('crypto')
const dotenv = require('dotenv')
const paymentModel = require('../../models/paymentModel')
const subscriptionModel = require('../../models/subscriptionModel')
const userModel = require('../../models/usersModel')
const { sendNotification } = require('../../utilis/socketNotification')

dotenv.config()

process.env.ADMIN_ID

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const payment = await paymentModel.findOneAndUpdate(
            { razorpay_order_id },
            {
                razorpay_payment_id,
                razorpay_signature,
                status: "paid",
            },
            { new: true }
        );

        const planType = payment.notes.planType || "monthly";
        const durationInDays = planType === "monthly" ? 30 : planType === "annual" ? 365 : 30;
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);

        const subscription = await subscriptionModel.findOneAndUpdate(
            { userId },
            {
                planType,
                startDate,
                endDate,
                isActive: true,
                paymentRef: payment._id,
                notes: payment.notes
            },
            { upsert: true, new: true }
        );

        await userModel.findOneAndUpdate({ _id: userId }, { subscriptionId: subscription._id }, { upsert: true, new: true })

        sendNotification(process.env.ADMIN_ID, {
            userId: process.env.ADMIN_ID,
            type: "success",
            category: "subscription_purchased",
            title: `new user subscribed`,
            message: `${userId} is subscribed ${planType} planType`,
        })

        res.status(200).json({
            success: true,
            message: "Payment verified and subscription activated",
        });
    } catch (err) {
        console.error("Error in verifyPayment:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

module.exports = verifyPayment