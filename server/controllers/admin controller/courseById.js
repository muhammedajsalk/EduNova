const CourseModel = require("../../models/courseModel");

async function courseById(req,res){
    try {
        const {id}=req.params
        const course=await CourseModel.findById(id).populate("instructorId","name avatar email")
        if(!course) return res.status(400).json({success:false,message:"the course is not available"})
        res.status(200).json({success:true,data:course})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=courseById