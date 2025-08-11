const express = require('express')
const me = require('../controllers/pablic/me')
const { jwtAuth, roleConform } = require('../middlewares/jwt Auth/jwtAuthMiddleware')
const getTopRatedCourses = require('../controllers/pablic/topRatedCourse')
const router = express.Router()


router.get('/me',jwtAuth,me)
router.get('/topRatedCourse',getTopRatedCourses)

module.exports=router