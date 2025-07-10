const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    lectures: { type: [LectureSchema], default: [] },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },

    curriculum: { type: [SectionSchema], default: [] },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", CourseSchema);
module.exports = CourseModel;
