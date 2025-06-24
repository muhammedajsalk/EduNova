const userModel = require("../../models/usersModel")
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config()


async function forgetPassword(req, res) {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (!user) return res.status(400).json({ success: false, message: "please register" })
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_CODE, { expiresIn: '15m' })
        user.resetToken = token
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const resetLink = `${process.env.CLIENT_URL}/ResetPassword?token=${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });
        return res.status(200).json({ success: true, message: "EMAIL_USER" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("error is: " + error)
    }
}

module.exports=forgetPassword