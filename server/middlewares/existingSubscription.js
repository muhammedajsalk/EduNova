const subscriptionModel = require("../models/subscriptionModel")

const existingSubscription = async (req, res, next) => {
    const { id } = req.user

    if(!id){
        return res.status(400).json({ success: false, message: "please login" })
    }

    try {
        const subscription = await subscriptionModel.findOne({ userId: id })
        if (subscription && subscription.isActive) {
            return res.status(409).json({ success: false, message: "You already have an active subscription" })
        }
        next()
    } catch (err) {
        console.error("Error in createPayment:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

module.exports = existingSubscription