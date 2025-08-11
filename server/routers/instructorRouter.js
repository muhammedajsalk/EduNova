const express = require('express')
const router = express.Router()
const register = require('../controllers/instructor controller/register')
const upload = require('../middlewares/instructor/cloudinaryUploader')
const tumbanailUploading=require('../middlewares/instructor/cloudineryTumbanailUploader')
const courseVideoUploader=require('../middlewares/instructor/cloudineryVideoUploader')
const instructorExisting=require('../middlewares/instructor/instractorsExisting')
const instructorEmailVerify=require('../controllers/instructor controller/instructorEmailVerify')
const otpAuth = require('../middlewares/nodeMailerAuth')
const login=require('../controllers/instructor controller/login')
const {instructorRegisterLimiter,authLimiter, uploadLimiter}=require('../middlewares/api limiter/separateApiLimiter')
const courseVideoUpload = require('../controllers/instructor controller/courseVideoUpload')
const { jwtAuth, roleConform } = require('../middlewares/jwt Auth/jwtAuthMiddleware')
const courseCreate = require('../controllers/instructor controller/courseCreate')
const thumbnailUpload = require('../controllers/instructor controller/courseThumbanailUploading')
const courseByInstructorId = require('../controllers/instructor controller/courseByInstructorId')
const instructorTotalWatch = require('../controllers/instructor controller/instructorTotalWatchTime')
const topLecturesByInstructor = require('../controllers/instructor controller/topLectureInstructorById')


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
router.post('/course/videoUploading',jwtAuth,courseVideoUploader.fields([
    {name:'video', maxCount:1}
]),courseVideoUpload)
router.post('/course/courseCreate',jwtAuth,courseCreate)
router.post('/course/thumbnailUploading',uploadLimiter,jwtAuth,tumbanailUploading.fields([
    {name:'image',maxCount:1}
]),thumbnailUpload)
router.get("/course/courseByInstructorId",jwtAuth,courseByInstructorId)
router.get("/course/totalWatchTime",jwtAuth,instructorTotalWatch)
router.get("/topLectures/:id",topLecturesByInstructor)
module.exports = router
