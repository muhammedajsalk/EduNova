const userModel = require("../../models/usersModel")

async function userById(req, res) {
    try {
        const { id } = req.params
        const user = await userModel.findById(id).populate("subscriptionId").populate({
            path: "enrolledCourses.course",
            populate: {
                path: "instructorId",
                model: "instructor" 
            }
        })
        if (!user) return res.status(400).json({ success: false, message: "the user not available" })
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports = userById