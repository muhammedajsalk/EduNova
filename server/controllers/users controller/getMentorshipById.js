const mongoose = require("mongoose");
const mentorshipModel = require("../../models/mentorshipModel");


const mentorshipGetById = async (req, res) => {
  try {
    const mentorshipId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentorship ID",
      });
    }

    const mentorship = await mentorshipModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(mentorshipId), isDeleted: false }
      },
      {
        $lookup: {
          from: "instructors",
          localField: "instructorId",
          foreignField: "_id",
          as: "instructor"
        }
      },
      { $unwind: "$instructor" },

      {
        $lookup: {
          from: "courses",
          localField: "instructor._id",
          foreignField: "instructorId",
          as: "courses"
        }
      },

      { $unwind: { path: "$courses", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$courses.curriculum", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$courses.curriculum.lectures", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            mentorshipId: "$_id",
            instructorId: "$instructor._id",
            instructorName: "$instructor.name",
            instructorImage: "$instructor.avatar",
            profession: "$instructor.profession",
            programName: "$programName",
            programFee: "$programFee",
            date: "$selectedDate",
            time: "$selectedTimes"
          },
          totalLikes: { $sum: "$courses.curriculum.lectures.like" },
          totalLectures: { $sum: { $cond: [{ $ifNull: ["$courses.curriculum.lectures", false] }, 1, 0] } }
        }
      },
      {
        $addFields: {
          instructorRating: {
            $cond: [
              { $gt: ["$totalLectures", 0] },
              { $round: [{ $divide: ["$totalLikes", "$totalLectures"] }, 1] },
              0
            ]
          }
        }
      },
      {
        $project: {
          _id: "$_id.mentorshipId",
          instructorId: "$_id.instructorId",
          instructorName: "$_id.instructorName",
          profession: "$_id.profession",
          programName: "$_id.programName",
          amount: "$_id.programFee",
          instructorRating: 1,
          date: "$_id.date",
          time: "$_id.time",
          instructorImage: "$_id.instructorImage"
        }
      }
    ]);

    if (!mentorship || mentorship.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mentorship[0],
    });
  } catch (error) {
    console.error("Error fetching mentorship by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = mentorshipGetById
