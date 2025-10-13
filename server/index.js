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
const startSubscriptionCleanupJob = require('./scheduled jobs/subscriptionCron');
const { initSocket } = require("./utilis/socketNotification");
const startCronJobs = require('./scheduled jobs/subscriptionCron');

const app = express();
const server_port = process.env.SERVER_PORT;
const server = http.createServer(app);

connectDb();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.use(cors({ origin: "https://edunovas.vercel.app", credentials: true }));

startCronJobs()

app.set('trust proxy', 1);
app.use(apiLimiterGlobally);
app.use('/api/users', usersRouter);
app.use('/api/instructor', instructorRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', pabulicRouter);
app.use('/api/message', messageRouter);
app.use('/api/notification', notificationRouter);


initSocket(server);

server.listen(server_port, () => {
  console.log(`🚀 Server running on port ${server_port}`);
});
