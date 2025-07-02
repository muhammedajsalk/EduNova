const instructorModel = require("../../models/instructorModel");

async function allInstructorShow(req,res){
    try {
        const instructor=await instructorModel.find({verificationStatus:"approved"})
        if(instructor.length===0) return res.status(200).json({success:true,message:"zero instructor available"})
        res.status(200).json({success:true,data:instructor})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=allInstructorShow