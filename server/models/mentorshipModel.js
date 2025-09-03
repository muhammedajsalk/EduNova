const mongoose = require("mongoose");

const mentorshipModelSchema = new mongoose.Schema({
    programName: {
        type: String,
        required: true
    },
    instructorId:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "instructor",
      required:true
    },
    programFee: {
        type: Number,
        required: true
    },
    selectedDate: {
        type: Date,
        required: true
    },
    selectedTimes: {
        type: [Date],
        required: true,
        default: []
    },
    students: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            bookedTime: { type: Date, default: Date.now }
        }
    ],
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{ timestamps: true })

const mentorshipModel = mongoose.model("mentorship", mentorshipModelSchema)

module.exports = mentorshipModel