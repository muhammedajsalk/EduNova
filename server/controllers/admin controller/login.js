const adminModel = require('../../models/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { OAuth2Client } = require('google-auth-library')


async function login(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        const body = req.body
        if (body.credential) {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
            const ticket = await client.verifyIdToken({
                idToken: body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
            const { email } = payload
            const isEmailIsAvailable = await adminModel.findOne({ email })
            const accesTokken = await jwt.sign({ id: isEmailIsAvailable._id, role: "admin" }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
            res.cookie("accesTokken", accesTokken, {
                httpOnly: true,
                secure: isProduction, // HTTPS only in production
                sameSite: isProduction ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.status(200).json({ success: true, message: "admin succefully logged" })
        }
        const { email, password } = body
        const admin = await adminModel.findOne({ email })
        if (!admin) return res.status(400).json({ success: false, message: "you entered details is incorrect" })
        const match = await bcrypt.compare(password, admin.password)
        if (!match) return res.status(400).json({ success: false, message: "you entered password is incorrect" })
        const accesTokken = await jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
        res.cookie("accesTokken", accesTokken, {
            httpOnly: true,
            secure: isProduction, // HTTPS only in production
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({ success: true, message: "Admin succefully logged" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log(error)
    }
}

module.exports = login