const { Server } = require("socket.io");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");

let io;

const userIdToSocketMap = new Map();
const socketToUserId = new Map()

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
          category: "message",
          title: "New Message",
          message: `${senderName} sent you a message`,
          meta: { senderImg, senderId, chatRoomId },
        });

        io.emit("notification", notification);

      } catch (err) {
        console.error("❌ Error saving message:", err.message);
      }
    });


    socket.on("join-lobby", (mentorshipId) => {
      socket.join(mentorshipId);
      console.log(`[Lobby] User ${socket.id} joined lobby for room: ${mentorshipId}`);
    });

    socket.on("user-is-calling", async ({ mentorshipId, userName, role, userId, offer, senderId }) => {
      const notification = await Notification.create({
        userId,
        type: "info",
        category: "mentorship_user_joined",
        title: "user is joined videocalling",
        message: `${userName} is joined videoCalling`,
        metadata: { mentorshipId, userName, role, userId },
      });
      const socketId = userIdToSocketMap.get(userId);
      io.emit("incoming-call", { from: senderId, offer, role });
      io.emit("notification", notification);
      console.log(`[Calling] ${role} ${userName} is calling in room ${mentorshipId}`);
    });

    socket.on("call-accepted", (data) => {
      console.log("call accepting.............")
      const { userId, ans } = data
      console.log("answerinngggggggggggg", ans)
      io.emit("call-accepted", { ans })
    })

    socket.on("video-room", ({ mentorshipId, userId, role }) => {
      try {
        userIdToSocketMap.set(userId, socket.id);
        socketToUserId.set(socket.id, userId);
        socket.join(mentorshipId);

        console.log(`[Socket] User joined - userId: ${userId}, role: ${role}, room: ${mentorshipId}`);

        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(mentorshipId) || []);

        const participants = socketsInRoom.map(sid => {
          return { socketId: sid };
        });

        socket.emit("participants", participants);

        socket.to(mentorshipId).emit("user-joined", { userId, role, socketId: socket.id });

      } catch (err) {
        console.error(`[Socket] Error in video-room handler:`, err);
      }
    });

    socket.on("negotiation-offer", ({ targetId, offer, senderId }) => {
      console.log(`[Server] Relaying negotiation offer from ${senderId} to ${targetId}`);
      const targetSocketId = userIdToSocketMap.get(targetId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("negotiation-offer", { from: senderId, offer });
      }
    });

    socket.on("negotiation-answer", ({ targetId, ans }) => {
      console.log(`[Server] Relaying negotiation answer to ${targetId}`);
      const targetSocketId = userIdToSocketMap.get(targetId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("negotiation-answer", { ans });
      }
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
