const CourseModel = require("../../models/courseModel");

exports.getLectureUrlByCourseTitle = async (req, res) => {
    try {
        const courseTitle = req.params.courseTitle;
        const courseId = req.params.courseId;

        if (!courseTitle) {
            return res.status(400).json({ success: false, message: "Course title is required" });
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        let lectureUrl = null;
        for (const section of course.curriculum) {
            const lecture = section.lectures.find(lec => lec.title === courseTitle);
            if (lecture) {
                lectureUrl = lecture.url;
                break;
            }
        }

        if (!lectureUrl) {
            return res.status(403).json({ success: false, message: "No lecture found" });
        }

        return res.status(200).json({
            success: true,
            url:lectureUrl,
        });

    } catch (error) {
        console.error("Error fetching lecture URL:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};