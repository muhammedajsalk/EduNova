const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel", 
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["users", "instructor"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel", 
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["users", "instructor"],
    },
    content: { type: String, trim: true },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
      default: "text",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const messageModel=mongoose.model("message",messageSchema)

module.exports=messageModel