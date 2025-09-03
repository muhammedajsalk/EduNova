const mentorshipModel = require("../../models/mentorshipModel")

const createMentorShip = async (req, res) => {
    try {
        const data = req.body
        const { id } = req.user
        if (!data) {
            return res.status(200).json({ success: false, message: "include the data" })
        }
        const instructorMentorShip=await mentorshipModel.findOne({instructorId:id,isDeleted:false,isActive:true})
        if(instructorMentorShip) return res.status(400).json({success:true,message:"you have already mentorship"})
        const newMentorShip = new mentorshipModel({ instructorId: id, ...data })
        await newMentorShip.save()
        res.status(200).json({ success: true, message: "new mentorship created" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=createMentorShip