const videoSessionModel = require("../../models/videoSessionModel")

const getAllMentorship=async (req,res)=>{
    try {
        const {id}=req.user
        const videoSession=await videoSessionModel.find({instructorId:id}).populate("userId").sort({ selectedTimes: -1 })
        res.status(200).json({success:true,data:videoSession})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=getAllMentorship