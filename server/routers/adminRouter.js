const express = require('express')
const login = require('../controllers/admin controller/login')
const { authLimiter } = require('../middlewares/api limiter/separateApiLimiter')
const router = express.Router()


router.post('/auth/login',authLimiter,login)

module.exports=router