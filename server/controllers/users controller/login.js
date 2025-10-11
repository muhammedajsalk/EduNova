const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const userModel = require("../../models/usersModel")


async function login(req, res) {
    try {
        const body = req.body
        if (body.credential) {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
            const ticket = await client.verifyIdToken({
                idToken: body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
            const { email, name, picture, sub } = payload
            const isEmailIsAvailable = await userModel.findOne({ email: email })
            if(!isEmailIsAvailable) return res.status(400).json({ success: false, message: "please register and come to login page" })
            if (isEmailIsAvailable.isActive === false) return res.status(400).json({ success: false, message: "your account is blocked" })
            if (isEmailIsAvailable) {
                const accesTokken = await jwt.sign({ id: isEmailIsAvailable._id, role: isEmailIsAvailable.role }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
                res.cookie("accesTokken", accesTokken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                    sameSite: 'none',
                    maxAge: 60 * 60 * 1000
                })
                isEmailIsAvailable.provider = "google"
                isEmailIsAvailable.name = name
                isEmailIsAvailable.googleId = sub
                isEmailIsAvailable.isVerified = true
                isEmailIsAvailable.otp = null
                isEmailIsAvailable.otpExpiry = null
                isEmailIsAvailable.avatar = picture
                isEmailIsAvailable.isActive = true

                await isEmailIsAvailable.save()
                return res.status(200).json({
                    success: true,
                    message: "user loged succefully",
                    data:isEmailIsAvailable
                })
            }
            const newUser = new userModel({
                name,
                email,
                avatar: picture,
                provider: "google",
                googleId: sub,
                isVerified: true,
                isActive: true
            })
            const saved = await newUser.save()

            const accesTokken = await jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })

            res.cookie("accesTokken", accesTokken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: 'none',
                maxAge: 60 * 60 * 1000
            })

            res.status(200).json({
                success: true,
                message: 'Successfully logged in',
                data: saved,
            })
        }
        const { email, password } = body
        const user = await userModel.findOne({ email })
        if (!user)
             return res.status(400).json({ success: false, message: "you entered incorrect details" })
        if (user.isActive === false) 
            return res.status(400).json({ success: false, message: "your account is blocked" })
        if (user.password === null) 
            return res.status(400).json({ success: false, message: "you registered with google and google to login otherwise forget password click" })
        const match = await bcrypt.compare(password, user.password)
        if (!match) 
            return res.status(400).json({ success: false, message: "you entered password is incorrect" })
        const accesTokken = await jwt.sign({ id: user._id,role:"user" }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
        res.cookie("accesTokken", accesTokken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000
        })
        res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            data:user
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log(error)
    }

}


module.exports = login