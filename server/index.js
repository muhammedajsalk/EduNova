const express=require('express')
require('dotenv').config()
const connectDb=require('./confiq/db')
const usersRouter=require('./routers/userRouter')

const app=express()
const server_port=process.env.SERVER_PORT
connectDb()
app.use(express.json())
app.use(express.urlencoded())
app.use('/api/users',usersRouter)

app.listen(server_port,()=>{
    console.log("server is runnig")
})