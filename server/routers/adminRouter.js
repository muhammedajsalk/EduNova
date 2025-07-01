const express = require('express')
const login = require('../controllers/admin controller/login')
const { authLimiter } = require('../middlewares/api limiter/separateApiLimiter')
const instructorPending = require('../controllers/admin controller/instructorPending')
const instructorById = require('../controllers/admin controller/instructorById')
const approveOrReject = require('../controllers/admin controller/approveOrReject')
const allInstructorShow = require('../controllers/admin controller/allInstructorShow')
const allUsersShow = require('../controllers/users controller/allUsersShow')
const userById = require('../controllers/admin controller/userById')
const blockAndUnblock = require('../controllers/users controller/blockAndUnbloack')
const router = express.Router()


router.post('/auth/login',authLimiter,login)
router.get('/instructorPending',instructorPending)
router.get('/instructorById/:id',instructorById)
router.post('/approvedOrRejected',approveOrReject)
router.get('/AllInstructor',allInstructorShow)
router.get('/AllUsers',allUsersShow)
router.get('/userById/:id',userById)
router.post('/userBlockAndUnblock/:id',blockAndUnblock)

module.exports=router