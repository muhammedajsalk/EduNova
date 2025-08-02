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
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    enrolledCourses: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            },
            courseStartDate: {
                type: Date,
                required: true
            },
            status: {
                type: String,
                enum: ['active', 'complete'],
                default: 'active'
            }
        }
    ],
    isVerified: { type: Boolean, default: false },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model('users', userSchema)

module.exports = userModel