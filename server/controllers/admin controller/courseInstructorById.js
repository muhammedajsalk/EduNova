const CourseModel = require("../../models/courseModel")

const courseInstructorById = async (req,res) => {
    try {
        const { id } = req.params
        if (!id) {
             res.status(400).json({success:false,message:"data fetching error"})
        }
        const courses=await CourseModel.find({instructorId:id}).populate("users")
        if(courses.length===0) return res.status(200).json({success:true,data:[]})
        res.status(200).json({success:true,data:courses})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=courseInstructorById