const express = require('express')
const me = require('../controllers/pablic/me')
const { jwtAuth, roleConform } = require('../middlewares/jwt Auth/jwtAuthMiddleware')
const router = express.Router()


router.get('/me',jwtAuth,me)

module.exports=router