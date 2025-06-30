const instructorModel = require("../../models/instructorModel");

async function instructorPending(req, res) {
    try {
        const instructor = await instructorModel.find({ verificationStatus: "pending" })
        if (instructor.length === 0) return res.status(200).json({ success: true, message: "instructor pending count 0", data: [] })
        res.status(200).json({ success: true, data: instructor })
    } catch (error) {
        res.status(500).json({ success: false,message:"server side error" })
        console.log("server side error: " + error)
    }
}

module.exports = instructorPending