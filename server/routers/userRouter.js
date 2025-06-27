const express=require('express')
const router=express.Router()
const userRegister=require("../controllers/users controller/register")
const otpSent = require('../controllers/users controller/otpGenerator')
const otpAuth = require('../middlewares/nodeMailerAuth')
const login = require('../controllers/users controller/login')
const forgetPassword = require('../controllers/users controller/forgetPassword')
const resetPassword = require('../controllers/users controller/resetPassword')
const {authLimiter,otpLimiter}=require('../middlewares/api limiter/separateApiLimiter')

router.post("/auth/register",[authLimiter,otpAuth],userRegister)
router.post("/auth/otpSent",otpLimiter,otpSent)
router.post("/auth/login",authLimiter,login)
router.post('/auth/forgetPassword',otpLimiter,forgetPassword)
router.post('/auth/resetPassword',resetPassword)


module.exports=router