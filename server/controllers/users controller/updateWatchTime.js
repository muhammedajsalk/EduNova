const CourseModel=require('../../models/courseModel')
const updateWatchTime = async (req, res) => {
    try {
        const { courseId, lectureId, watchTime } = req.body;
        const course = await CourseModel.findOne({ _id: courseId });
        if (!course) return res.status(400).json({ success: false, message: "Course not found" });

        let lectureFound = null;
        for (let section of course.curriculum) {
            const lecture = section.lectures.id(lectureId);
            if (lecture) {
                lecture.totalWatchTime = watchTime;
                lectureFound = lecture;
                break;
            }
        }
        if (!lectureFound) return res.status(400).json({ success: false, message: "Lecture not found" });

        await course.save();
        return res.status(200).json({ success: true, message: "Watch time updated" });
    } catch (error) {
        console.error("Error updating watch time:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = updateWatchTime;