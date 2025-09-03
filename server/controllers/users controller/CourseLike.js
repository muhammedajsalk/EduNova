const CourseModel = require("../../models/courseModel")
const userModel = require("../../models/usersModel")

const courseLike = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body
        const { id } = req.user
        const user = await userModel.findById(id)
        const course=await CourseModel.findById(courseId)
        if(user.userLikedVideos.includes(lectureId)) return res.status(400).json({ success: false, message: "the already liked" })
        if (!user.userLikedVideos.includes(lectureId)) {
            let lectureFound = null;
            for (let section of course.curriculum) {
                const lecture = section.lectures.id(lectureId);
                if (lecture) {
                    lecture.like += 1;
                    lectureFound = lecture;
                    user.userLikedVideos.push(lectureId)
                }
            }
        }
        await course.save()
        await user.save()
        res.status(200).json({ success: true, message: "the like succefully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=courseLike