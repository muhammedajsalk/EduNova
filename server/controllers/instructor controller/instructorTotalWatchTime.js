const mongoose = require("mongoose");
const CourseModel = require("../../models/courseModel");


const instructorTotalWatch = async (req,res) => {
    try {
        const instructorId = new mongoose.Types.ObjectId(req.user.id);
        const totalWatchTimePipeline = [
            { $match: { instructorId } },
            { $unwind: "$curriculum" },
            { $unwind: "$curriculum.lectures" },
            {
                $group: {
                    _id: "$instructorId",
                    totalWatchTime: { $sum: "$curriculum.lectures.totalWatchTime" },
                },
            },
        ];

        const result = await CourseModel.aggregate(totalWatchTimePipeline);
        res.status(200).json({success:true,data:result})
    } catch (error) {
        console.error("Course creation error:", error);
        res.status(400).json({ success: false, error });
    }
}

module.exports=instructorTotalWatch