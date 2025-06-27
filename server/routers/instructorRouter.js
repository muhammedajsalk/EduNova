const express = require('express')
const register = require('../controllers/instructor controller/register')
const router = express.Router()
const upload = require('../middlewares/instructor/cloudinaryUploader')
const instructorExisting=require('../middlewares/instructor/instractorsExisting')
const instructorEmailVerify=require('../controllers/instructor controller/instructorEmailVerify')
const otpAuth = require('../middlewares/nodeMailerAuth')
const login=require('../controllers/instructor controller/login')
const {instructorRegisterLimiter,authLimiter}=require('../middlewares/api limiter/separateApiLimiter')


router.post('/auth/register', [instructorRegisterLimiter,upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'demoVideo', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 },
    { name: 'experienceLetter', maxCount: 1 },
    { name: 'certification', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }])]
    , register)

router.post('/auth/emailVerify',otpAuth,instructorEmailVerify)
router.post('/auth/login',authLimiter,login)
module.exports = router
