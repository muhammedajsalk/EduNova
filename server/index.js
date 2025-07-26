const express=require('express')
require('dotenv').config()
const connectDb=require('./confiq/db')
const usersRouter=require('./routers/userRouter')
const instructorRouter=require('./routers/instructorRouter')
const adminRouter=require('./routers/adminRouter')
const cors=require("cors")
const cookieParser=require('cookie-parser')
const apiLimiterGlobally=require('./middlewares/api limiter/globallyApiLimiter')
const pabulicRouter=require('./routers/pablicRouter')
const startSubscriptionCleanupJob = require('./scheduled jobs/subscriptionCron')

const app=express()
const server_port=process.env.SERVER_PORT
connectDb()
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(cors({origin:"http://localhost:5173",credentials:true}))

startSubscriptionCleanupJob()

app.use(apiLimiterGlobally)
app.use('/api/users',usersRouter)
app.use('/api/instructor',instructorRouter)
app.use('/api/admin',adminRouter)
app.use('/api/public',pabulicRouter)


app.listen(server_port,()=>{
    console.log("server is runnig")
})