const express=require('express')
require('dotenv').config()
const connectDb=require('./confiq/db')

const app=express()
const server_port=process.env.SERVER_PORT
connectDb()

app.get("/api",(req,res)=>{
    res.json("hello guys")
})

app.listen(server_port,()=>{
    console.log("server is runnig")
})