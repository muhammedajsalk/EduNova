const userModel = require("../../models/usersModel");

async function allUsersShow(req,res){
    try {
        const user=await userModel.find({isVerified:true})
        if(user.length===0) return res.status(200).json({success:true,message:"zero users available"})
        res.status(200).json({success:true,data:user})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=allUsersShow