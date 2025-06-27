const instructorModel = require('../../models/instructorModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { OAuth2Client } = require('google-auth-library')

async function login(req, res) {
    try {
        const body = req.body
        if (body.credential) {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)//google login and registration
            const ticket = await client.verifyIdToken({
                idToken: body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
            const { email } = payload
            const isEmailIsAvailable = await instructorModel.findOne({ email })
            if(!isEmailIsAvailable) return res.status(400).json({ success: false, message: "please register" })
            if (isEmailIsAvailable.verificationStatus === "pending") return res.status(400).json({ success: false, message: "your details is reviewing come to after 24hr" })
            if (isEmailIsAvailable.verificationStatus === "approved") {
                const accesTokken = await jwt.sign({ id: isEmailIsAvailable._id, role: "instructor" }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
                res.cookie("accesTokken", accesTokken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000
                })
                return res.status(200).json({ success: true, message: "instructor succefully logged" })
            }
        }
        const { email, password } = req.body
        const instructor = await instructorModel.findOne({ email })
        if (!instructor) return res.status(400).json({ success: false, message: "you entered details is incorrect" })
        const match = await bcrypt.compare(password, instructor.password)
        if (!match) return res.status(400).json({ success: false, message: "you entered password is incorrect" })
        if (instructor.verificationStatus === "pending") return res.status(400).json({ success: false, message: "your details is reviewing come to after 24hr" })
        const accesTokken = await jwt.sign({ id: instructor._id, role: "instructor" }, process.env.JWT_SECRET_CODE, { expiresIn: "7d" })
        res.cookie("accesTokken", accesTokken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })
        res.status(200).json({ success: true, message: "instructor succefully logged" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log(error)
    }
}

module.exports = login