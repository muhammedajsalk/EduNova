const userModel = require('../../models/usersModel')
const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function otpSent(req, res, next) {
    const { email } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const user = await userModel.findOne({ email })
    if(user){
       if(user.email&&user.isVerified) return res.status(400).json({ message: "the email is already existing" });
    }
    if (!user) {
        const newUser = new userModel({
            name: "user",
            email,
            otp,
            otpExpiry
        })
        await newUser.save()
    } else {
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
    }
    await transporter.sendMail({
        to: email,
        subject: "Your OTP Code - Do Not Share",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Email Verification Code</h2>
      <p>Use the OTP below to verify your email address. This code is valid for <strong>5 minutes</strong>.</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #4CAF50;">${otp}</span>
      </div>

      <p style="color: #d9534f;"><strong>Do not share this code with anyone.</strong> If you did not request this, please ignore the email.</p>
      
      <p>Thank you,<br/>EduNova Support Team</p>
    </div>
  `
    });


    res.json({ message: "OTP sent to email." });
}

module.exports = otpSent