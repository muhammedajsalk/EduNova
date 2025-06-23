const userModel = require('../models/usersModel')
const bcrypt = require('bcryptjs')


async function otpAuth(req, res, next) {
    try {
        if(req.body.email) {
            const { otp, name, email, password } = req.body
            const user = await userModel.findOne({ email })
            const existingUser = await userModel.findOne({ email, name })
            if (existingUser) return res.status(409).json({ success: false, message: "the user is already registered" })
            if (user.otp !== otp) return res.status(400).json({ success: false, message: "otp is invaild" })
            if (user.otpExpiry < Date.now()) return res.status(400).json({ error: "OTP expired." });
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
            const hashedPassword = await bcrypt.hash(password, 10)
            user.isVerified = true;
            user.otp = null;
            user.otpExpiry = null;
            user.name = name
            user.password = hashedPassword;
            user.avatar = avatarUrl
            await user.save();
            return res.status(200).json({ success: true, message: "user loged succefully successfully." });
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "server side error otpauth" })
    }
}

module.exports = otpAuth