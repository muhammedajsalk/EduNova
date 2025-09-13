const crypto = require('crypto')
const dotenv = require('dotenv')
const paymentModel = require('../../models/paymentModel')
const userModel = require('../../models/usersModel')
const videoSessionModel = require('../../models/videoSessionModel')
const mentorshipModel = require('../../models/mentorshipModel')
const { sendNotification } = require('../../utilis/socketNotification')

dotenv.config()

const verifyMentoshipPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, instructorId, mentorshipId, selectedDate, selectedTimes, programFee, programName } = req.body;
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

        const videoSession = await videoSessionModel.create({
            instructorId,
            mentorshipId,
            selectedDate,
            selectedTimes,
            programFee,
            userId,
            programName
        })

        const user = await userModel.findOne({ _id: userId })
        user.mentorshipId.push(mentorshipId)

        await user.save()

        const mentorship = await mentorshipModel.findByIdAndUpdate(
            mentorshipId,
            {
                $pull: { selectedTimes: selectedTimes },
                $push: {
                    students: {
                        studentId: userId,
                        bookedTime: selectedTimes
                    }
                }
            },
            { new: true }
        );

        if (mentorship.selectedTimes.length === 0) {
            mentorship.isActive = false
            await mentorship.save()
        }

        sendNotification(instructorId, {
            userId: instructorId,
            type: "success",
            category: "mentorship_purchased",
            title: `purchased mentorship`,
            message: `${userId} is purchased your ${programName} mentorship session`,
        })

        sendNotification(process.env.ADMIN_ID, {
            userId: process.env.ADMIN_ID,
            type: "success",
            category: "mentorship_purchased",
            title: `purchased mentorship`,
            message: `${userId} is purchased ${instructorId} ${programName} mentorship session`,
        })

        res.status(200).json({
            success: true,
            message: "Payment verified and mentorship activated",
        });
    } catch (err) {
        console.error("Error in verifyPayment:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

module.exports = verifyMentoshipPayment