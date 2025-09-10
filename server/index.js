const express = require('express')
require('dotenv').config()
const http = require("http");
const connectDb = require('./confiq/db')
const usersRouter = require('./routers/userRouter')
const instructorRouter = require('./routers/instructorRouter')
const adminRouter = require('./routers/adminRouter')
const cors = require("cors")
const cookieParser = require('cookie-parser')
const apiLimiterGlobally = require('./middlewares/api limiter/globallyApiLimiter')
const pabulicRouter = require('./routers/pablicRouter')
const messageRouter = require("./routers/messageRouter")
const startSubscriptionCleanupJob = require('./scheduled jobs/subscriptionCron')
const { Server } = require('socket.io');
const messageModel = require('./models/messageModel');
const verifySocketJWT = require('./middlewares/jwt Auth/jwtAuthSocket');

const app = express()
const server_port = process.env.SERVER_PORT

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
})

connectDb()
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

startSubscriptionCleanupJob()

app.use(apiLimiterGlobally)
app.use('/api/users', usersRouter)
app.use('/api/instructor', instructorRouter)
app.use('/api/admin', adminRouter)
app.use('/api/public', pabulicRouter)
app.use(`/api/message`, messageRouter)


io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId)
        console.log(`📌 User ${socket.id} joined room ${roomId}`);
    })
    socket.on("sendMessage", async (data) => {
        const { chatRoomId, senderId, receiverId, content, senderModel, receiverModel } = data;
        console.log(data)
        try {
            const message = await messageModel.create({
                chatRoomId,
                senderId,
                receiverId,
                senderModel,
                receiverModel,
                content,
            });
            io.emit("receiveMessage", message.toObject?.() ?? message);
        } catch (err) {
            console.error("❌ Error saving message:", err.message);
        }
    })
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
})


server.listen(server_port, () => {
    console.log(`🚀 Server running on port ${server_port}`)
});
