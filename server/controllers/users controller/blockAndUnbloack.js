const userModel = require("../../models/usersModel");

async function blockAndUnblock(req,res){

     try {
        const {id}=req.params
        const {isActive}=req.body
        const user=await userModel.findById(id)
        if(!user) return res.status(400).json({success:true,message:"the user is not found"})
        if(isActive){
             user.isActive=true
             await user.save()
             return res.status(200).json({success:true,message:"user unblock succesfully"})
        }
        user.isActive=false
        await user.save()
        res.status(200).json({success:true,message:"user block succesfully"})
     } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
     }
}

module.exports=blockAndUnblock