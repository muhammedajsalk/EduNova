
const CourseModel = require("../../models/courseModel")
const instructorModel = require("../../models/instructorModel")
const subscriptionModel = require("../../models/subscriptionModel")
const userModel = require("../../models/usersModel")



const now = new Date();


const courseEntroll = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user?.id
        const course = await CourseModel.findById(id)
        if (!course) return res.status(404).json({ success: false, message: "the course not found" })
        const subscription = await subscriptionModel.findOne({ userId, isActive: true })
        if (!subscription) return res.status(400).json({ success: false, message: "please subscribe" })
        const user = await userModel.findById(userId)
        const instructor = await instructorModel.findById(course.instructorId)
        if (user.enrolledCourses.some(c => c.course.equals(course._id))) return res.status(400).json({ success: false, message: "you already entrolled this course" })
        user.enrolledCourses.push({
            course: course._id,
            courseStartDate: now,
        })
        if (!course.students.some(s => s.equals(user._id))) {
            course.students.push(user._id);
        }
        if (instructor) {
            instructor.students += 1
            await instructor.save()
        }
        await course.save()
        await user.save()
        res.status(200).json({ success: true, message: "user entroll succesfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports = courseEntroll