const CourseModel = require("../../models/courseModel");

async function getAllCourse(req,res){
    try {
        const courseData=await CourseModel.find({status:"approved"}).populate("instructorId","name avatar email")
        if(courseData.length===0) return res.status(200).json({success:true,data:[]})
        res.status(200).json({success:true,data:courseData})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=getAllCourse