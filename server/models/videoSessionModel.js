const mongoose = require("mongoose");

const videoSessionModelSchema = new mongoose.Schema({
    programName: {
        type: String,
        required: true
    },
    mentorshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mentorship",
        required: true
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instructor",
        required: true
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
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    status:{
      type:String,
      enum:["completed","upcomming","canceled"],
      default:"upcomming"
    }
}, { timestamps: true })

const videoSessionModel = mongoose.model("videoSession", videoSessionModelSchema)

module.exports = videoSessionModel