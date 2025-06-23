const userModel=require("../../models/usersModel")
const bcrypt=require('bcryptjs')


async function userRegister(req,res){
    try {
        const {name,email,password}=req.body
        const isEmailIsAvailable=await userModel.findOne({email:email})
        if(isEmailIsAvailable) return res.status(409).json({
            success:false,
            message:"the email already registered please try another email"
        })
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=new userModel({
            name,
            email,
            password:hashedPassword,
        })
        const saved=await newUser.save()
        res.status(201).json({success:true,message:"user registered succefully",data:saved})
    } catch (error) {
        res.status(500).json({success:false,message:"server side error"})
        console.log("error is: "+error)
    }
}

module.exports=userRegister
