const { Server } = require("socket.io");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinNotifications", (userId) => {
      socket.join(userId);
      console.log(`📌 User ${userId} joined notifications`);
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`💬 User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { chatRoomId, senderId, receiverId, content, senderModel, receiverModel, senderImg, senderName } = data;
      try {
        const message = await Message.create({
          chatRoomId,
          senderId,
          receiverId,
          senderModel,
          receiverModel,
          content,
        });

        io.emit("receiveMessage", message.toObject?.() ?? message);

        const notification = await Notification.create({
          userId: receiverId,
          type: "info",
          category:"message",
          title: "New Message",
          message: `${senderName} sent you a message`,
          meta: { senderImg, senderId, chatRoomId },
        });

        io.emit("notification", notification);

      } catch (err) {
        console.error("❌ Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

const sendNotification = async (userId, data) => {
  const notification = await Notification.create({ userId, ...data });
  io.emit("notification", notification);
  return notification;
};

module.exports = { initSocket, sendNotification };
