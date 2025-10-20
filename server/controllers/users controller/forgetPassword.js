const userModel = require("../../models/usersModel")
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const instructorModel = require("../../models/instructorModel");
require('dotenv').config()


async function forgetPassword(req, res) {
    try {
        const { email, role } = req.body
        const model = role === "user" ? userModel : instructorModel;
        const user = await model.findOne({ email })
        if (!user) return res.status(400).json({ success: false, message: "please register" })
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_CODE, { expiresIn: '15m' })
        user.resetToken = token
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const resetLink = `${process.env.CLIENT_URL}/ResetPassword/${token}/${role}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password - Action Required",
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You recently requested to reset your password. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
           Reset Password
        </a>
      </div>
      <p>This link will expire in 5 minutes for your security.</p>
      <p>If you did not request this, please ignore this email. No changes will be made to your account.</p>
      <p>Regards,<br/>EduNova Support Team</p>
    </div>
  `
        });
        return res.status(200).json({ success: true, message: "EMAIL_USER" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("error is: " + error)
    }
}

module.exports = forgetPassword