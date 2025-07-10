const CourseModel = require("../../models/courseModel");

async function coursePending(req, res) {
    try {
        const coursePending = await CourseModel.find({ status: "pending" }).populate("instructorId","name avatar")
        if (coursePending.length === 0) return res.status(200).json({ success: true, data: [] })
        res.status(200).json({ success: true, data: coursePending })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=coursePending