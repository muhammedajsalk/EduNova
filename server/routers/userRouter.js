const express=require('express')
const router=express.Router()
const userRegister=require("../controllers/users controller/register")
const otpSent = require('../controllers/users controller/otpGenerator')
const otpAuth = require('../middlewares/nodeMailerAuth')


router.post("/auth/register",otpAuth,userRegister)
router.post("/auth/otpSent",otpSent)

module.exports=router