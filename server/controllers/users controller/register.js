const userModel = require("../../models/usersModel")
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()
const jwt = require("jsonwebtoken")


async function userRegister(req, res) {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)//google login and registration
        const body = req.body

        if (!body) {
            throw new AppError('No google credentials provided!', 400)
        }

        const ticket = await client.verifyIdToken({
            idToken: body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const { email, name, picture, sub } = payload

        const isEmailIsAvailable = await userModel.findOne({ email: email })
        if (isEmailIsAvailable) {
            const accesTokken = await jwt.sign({ id: isEmailIsAvailable._id ,role:isEmailIsAvailable.role}, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
            res.cookie("accesTokken", accesTokken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            })
            isEmailIsAvailable.provider="google"
            isEmailIsAvailable.name=name
            isEmailIsAvailable.googleId=sub
            isEmailIsAvailable.isVerified=true
            isEmailIsAvailable.otp=null
            isEmailIsAvailable.otpExpiry=null
            isEmailIsAvailable.avatar=picture

            await isEmailIsAvailable.save()
            return res.status(200).json({
                success: true,
                message: "user loged succefully"
            })
        }

        const newUser = new userModel({
            name,
            email,
            avatar: picture,
            provider: "google",
            googleId: sub,
            isVerified:true
        })
        const saved = await newUser.save()

        const accesTokken = await jwt.sign({ id: newUser._id,role:newUser.role }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })

        res.cookie("accesTokken", accesTokken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })

        res.status(200).json({
            status: true,
            message: 'Successfully logged in',
            data: saved,
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("error is: " + error)
    }
}

module.exports = userRegister
