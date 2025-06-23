const express=require('express')
const router=express.Router()
const userRegister=require("../controllers/users controller/register")


router.post("/auth/register",userRegister)


module.exports=router