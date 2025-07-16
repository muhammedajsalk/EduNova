const adminModel=require('../../models/adminModel')
const instructorModel=require('../../models/instructorModel')
const userModel=require('../../models/usersModel')

async function me(req, res) {
    try {
        if (!req.user) {
            return res.status(200).json({ success: true, data: null });
        }
        const {role,id}=req.user
        const model =
            role === "admin"
                ? adminModel
                : role === "instructor"
                    ? instructorModel
                    : userModel;
        const modelNew=await model.findById(id).select("-password")
        if(!modelNew) return res.status(400).json({success:false,message:"user not found"})
        res.status(200).json({success:true,data:modelNew})
    } catch (error) {
        res.status(400).json({success:false,message:"server side error"})
        console.log(error)
    }
}

module.exports=me