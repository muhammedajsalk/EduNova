
const mentorshipModel = require("../../models/mentorshipModel");


const getAllMentorships = async (req, res) => {
  try {
    const mentorships = await mentorshipModel.aggregate([
      {
        $match: { isDeleted: false,isActive: true}
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

      // Lookup instructor's courses
      {
        $lookup: {
          from: "courses",
          localField: "instructor._id",
          foreignField: "instructorId",
          as: "courses"
        }
      },

      // Calculate rating from all lectures
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
          instructorName: "$_id.instructorName",
          profession: "$_id.profession",
          programName: "$_id.programName",
          amount: "$_id.programFee", // mentorship amount
          instructorRating: 1,
          date: "$_id.date",
          time: "$_id.time",
          instructorImage: "$_id.instructorImage"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: mentorships
    });
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = getAllMentorships;
