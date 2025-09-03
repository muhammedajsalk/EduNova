const razorpay = require("../../confiq/razropay")
const paymentModel = require("../../models/paymentModel")

const buyMentorship = async (req, res) => {
    try {
        const { id } = req.user
        const userId = id
        const {mentorshipId,programFee} = req.body

        const receiptId = `receipt_${Math.random().toString(36).substring(2, 10)}`;

        const currency = "INR";

        const options = {
            amount: programFee * 100,
            currency,
            receipt: receiptId,
            notes: {
                userId: String(userId),
                mentorshipId
            },
        };

        const order = await razorpay.orders.create(options);

        const payment = await paymentModel.create({
            userId,
            razorpay_order_id: order.id,
            amount:programFee,
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
    } catch (error) {
        console.error("Error fetching mentorship by ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports = buyMentorship