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
    if (!user) {
        const newUser = new userModel({
            name:"user",
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
        subject: "Your OTP Code",
        html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 5 minutes.do not share others keep privacy</p>`,
    });

    res.json({ message: "OTP sent to email." });
}

module.exports = otpSent