const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
    },

    avatar: {
        type: String, // URL to avatar image
    },

    // Profile Info
    bio: {
        type: String,
        maxlength: 1000,
    },

    skills: {
        type: [String], // e.g., ["JavaScript", "React", "Teaching"]
    },

    // Instructor Course Info
    myCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],

    // Earnings & Financials
    earnings: {
        type: Number,
        default: 0,
    },

    withdrawals: [{
        amount: Number,
        date: Date,
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        }
    }],

    // Verification Info

    demoVideo: {
        type: String,
    },

    linkedInProfile: {
        type: String,
    },

    documents: {
        degreeCertificate: { type: String },
        experienceLetter: { type: String },
        idProof: { type: String },
        certification:{type:String}
        
    },

    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected","default"],
        default: "default",
    },

    rejectionReason: {
        type: String,
        default: ""
    },

    submittedAt: {
        type: Date,
        default: Date.now,
    },

    reviewedAt: {
        type: Date,
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    otp:{
        type:String
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
        default: "instructor"
    },
    isActive:{
        type:Boolean,
        default:false
    },
    students:{
        type:Number,
        default:0
    },
    company_revenue:{
        type:Number,
        default:0
    }
}, {
    timestamps: true,
});

const instructorModel=mongoose.model("instructor", instructorSchema);
module.exports = instructorModel