const express = require('express')
const login = require('../controllers/admin controller/login')
const { authLimiter } = require('../middlewares/api limiter/separateApiLimiter')
const instructorPending = require('../controllers/admin controller/instructorPending')
const instructorById = require('../controllers/admin controller/instructorById')
const approveOrReject = require('../controllers/admin controller/approveOrReject')
const allInstructorShow = require('../controllers/admin controller/allInstructorShow')
const allUsersShow = require('../controllers/users controller/allUsersShow')
const userById = require('../controllers/admin controller/userById')
const userblockAndUnblock = require('../controllers/users controller/blockAndUnbloack')
const instructorblockAndUnbloack=require('../controllers/instructor controller/blockAndUnblock')
const coursePending = require('../controllers/admin controller/coursePending')
const courseById = require('../controllers/admin controller/courseById')
const courseApproveOrReject = require('../controllers/admin controller/courseRejectOrApprove')
const router = express.Router()
const {jwtAuth} =require('../middlewares/jwt Auth/jwtAuthMiddleware')
const getAllCourse = require('../controllers/admin controller/getAllCourse')


router.post('/auth/login',authLimiter,login)
router.get('/instructorPending',jwtAuth,instructorPending)
router.get('/instructorById/:id',jwtAuth,instructorById)
router.post('/approvedOrRejected',jwtAuth,approveOrReject)
router.get('/AllInstructor',jwtAuth,allInstructorShow)
router.get('/AllUsers',jwtAuth,allUsersShow)
router.get('/userById/:id',jwtAuth,userById)
router.post('/userBlockAndUnblock/:id',jwtAuth,userblockAndUnblock)
router.post('/instructorBlockAndUnBlock/:id',jwtAuth,instructorblockAndUnbloack)
router.get('/coursePending',jwtAuth,coursePending)
router.get("/courseById/:id",jwtAuth,courseById)
router.post('/courseApproveAndReject',jwtAuth, courseApproveOrReject)
router.get("/allCourses",jwtAuth,getAllCourse)
module.exports=router