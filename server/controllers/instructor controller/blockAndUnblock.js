const instructorModel = require("../../models/instructorModel")



async function blockAndUnblock(req,res){

     try {
        const {id}=req.params
        const {isActive}=req.body
        const instructor=await instructorModel.findById(id)
        if(!instructor) return res.status(400).json({success:true,message:"the instructor is not found"})
        if(isActive){
             instructor.isActive=true
             await instructor.save()
             return res.status(200).json({success:true,message:"instructor unblock succesfully"})
        }
        instructor.isActive=false
        await instructor.save()
        res.status(200).json({success:true,message:"instructor block succesfully"})
     } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
     }
}

module.exports=blockAndUnblock