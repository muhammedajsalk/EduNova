const express=require('express')
const router=express.Router()
const userRegister=require("../controllers/users controller/register")
const otpSent = require('../controllers/users controller/otpGenerator')
const otpAuth = require('../middlewares/nodeMailerAuth')
const login = require('../controllers/users controller/login')
const forgetPassword = require('../controllers/users controller/forgetPassword')
const resetPassword = require('../controllers/users controller/resetPassword')


router.post("/auth/register",otpAuth,userRegister)
router.post("/auth/otpSent",otpSent)
router.post("/auth/login",login)
router.post('/auth/forgetPassword',forgetPassword)
router.post('/auth/resetPassword',resetPassword)


module.exports=router