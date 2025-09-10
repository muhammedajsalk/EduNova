const chatRoomModel = require("../../models/chatRoomModel")
const messageModel = require("../../models/messageModel")
const courseModel=require('../../models/courseModel')

const chatRoomController = async (req, res) => {
  try {
    const { userId, instructorId } = req.body;

    console.log("userid instructrorid",{userId,instructorId})

    let room = await chatRoomModel.findOne({
      participants: { $all: [userId, instructorId] },
    });

    if (!room) {
      room = await chatRoomModel.create({
        participants: [userId, instructorId],
      });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({
      success: false,
      name: error.name,       // e.g. MissingSchemaError
      message: error.message, // short description
      stack: error.stack,
    })
  }
};


const messageRoomController = async (req, res) => {
  try {
    const chatRoomId = req.params.id
    const message = await messageModel.find({ chatRoomId }).populate("senderId receiverId").sort({ createdAt: 1 });
    res.json(message)
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({
      success: false,
      name: error.name,       // e.g. MissingSchemaError
      message: error.message, // short description
      stack: error.stack,
    })
  }
}

const sendMessageController = async (req, res) => {
  try {
    const { chatRoomId, senderId, receiverId, content, senderModel, receiverModel } = req.body
    const message = await messageModel.create({
      chatRoomId,
      senderId,
      receiverId,
      senderModel,
      receiverModel,
      content,
    });
    res.json(message)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getCourseStudents(req, res) {
  try {
    const { courseId,currentChatRoomId } = req.params;

    const course = await courseModel.findById(courseId)
      .select("students")
      .populate("students._id", "_id name email avatar");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const students = course.students.map((s) => ({
      ...s._id.toObject(), // populated student details
      currentChatRoomId,   // add currentChatRoomId to each student
    }));

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("server side error:", error);
    res.status(500).json({ success: false, message: "server side error" });
  }
}





module.exports = {
  chatRoomController,
  messageRoomController,
  sendMessageController,
  getCourseStudents
};
