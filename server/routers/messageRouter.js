const express = require('express')
const { jwtAuth } = require('../middlewares/jwt Auth/jwtAuthMiddleware')
const router = express.Router()
const {chatRoomController,messageRoomController, sendMessageController, getCourseStudents}=require('../controllers/message controller/chatController')


router.post("/chat-room",chatRoomController)
router.get("/chat-room/:id/messages",messageRoomController)
router.post("/message",sendMessageController)
router.get("/course/:courseId/:currentChatRoomId",getCourseStudents)

module.exports=router