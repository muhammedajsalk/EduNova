const express = require('express');
require('dotenv').config();
const http = require("http");
const connectDb = require('./confiq/db');
const usersRouter = require('./routers/userRouter');
const instructorRouter = require('./routers/instructorRouter');
const adminRouter = require('./routers/adminRouter');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const apiLimiterGlobally = require('./middlewares/api limiter/globallyApiLimiter');
const pabulicRouter = require('./routers/pablicRouter');
const messageRouter = require("./routers/messageRouter");
const notificationRouter = require('./routers/notificationRouter');
const startCronJobs = require('./scheduled jobs/subscriptionCron');
const { initSocket } = require("./utilis/socketNotification");

const app = express();
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 5000;

// ✅ Connect DB
connectDb();

// ✅ Must come early
app.set('trust proxy', 1);

// ✅ CORS setup for Render + Vercel
app.use(cors({
  origin: "https://edunovas.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ✅ Body parsers
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());

// ✅ Global middlewares
app.use(apiLimiterGlobally);

// ✅ Routers
app.use('/api/users', usersRouter);
app.use('/api/instructor', instructorRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', pabulicRouter);
app.use('/api/message', messageRouter);
app.use('/api/notification', notificationRouter);

// ✅ Background jobs
startCronJobs();

// ✅ Initialize sockets
initSocket(server);

// ✅ Test cookie route (optional)
app.get("/api/test-cookie", (req, res) => {
  const token = req.cookies.accesTokken;
  res.json(token ? { success: true, token } : { success: false, message: "No cookie found" });
});

// ✅ Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
