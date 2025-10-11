const mentorshipModel = require("../../models/mentorshipModel")
const instructorById = require("../admin controller/instructorById")

const mentorshipById=async (req,res)=>{
    try {
        const {id}=req.params
        console.log(id)
        const mentorship=await mentorshipModel.findOne({instructorId:id,isActive:true}).populate("instructorId")
        if(!mentorship) return res.status(400).json({success:false,message:"mentorship not available"})
        res.status(200).json({success:true,data:mentorship})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=mentorshipById