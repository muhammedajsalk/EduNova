const videoSessionModel = require("../../models/videoSessionModel")

const getUserMentorshipById = async (req, res) => {
    try {
        const { id } = req.user
        const userMentorship = await videoSessionModel.find({ userId: id ,isActive:true}).populate('instructorId')
        res.status(200).json({ success: true, data: userMentorship })
    } catch (error) {
        console.error("Error fetching mentorship by ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports=getUserMentorshipById