const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
    },
    provider: {
        type: String,
        default: "local",
    },
    googleId: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    subscription: {
        type: Object,
        default: {
            plan: "none",
            status: "none",
            startDate: "none",
            endDate: "none"
        }
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    isVerified: { type: Boolean, default: false },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
    resetToken:{
        type:String,
        default:null
    },
    resetTokenExpiry:{
        type:Date,
        default:null
    },
    role:{
        type:String,
        default:"user"
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model('users', userSchema)

module.exports = userModel