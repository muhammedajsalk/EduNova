const mongoose = require("mongoose");
const CourseModel = require("../../models/courseModel");

async function getTopRatedCourses(req, res) {
  try {
    const limit = 10;

    const topCourses = await CourseModel.aggregate([
      // ✅ Only approved courses
      { $match: { status: "approved" } },

      { $unwind: "$curriculum" },
      { $unwind: "$curriculum.lectures" },

      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          thumbnail: { $first: "$thumbnail" },
          category: { $first: "$category" },
          instructorId: { $first: "$instructorId" },
          totalLikes: { $sum: "$curriculum.lectures.like" },
          totalWatchTime: { $sum: "$curriculum.lectures.totalWatchTime" }
        }
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
        $addFields: {
          instructorName: "$instructor.name",
          score: {
            $add: [
              { $multiply: ["$totalLikes", 0.7] },
              { $multiply: ["$totalWatchTime", 0.3] }
            ]
          }
        }
      },
      {
        $project: {
          instructorId: 0,
          instructor: 0
        }
      },

      { $sort: { score: -1 } },
      { $limit: limit }
    ]);

    res.status(200).json({ data: topCourses });
  } catch (err) {
    console.error("Error fetching top rated courses:", err);
    res.status(500).json({ error: "Failed to fetch top rated courses" });
  }
}

module.exports = getTopRatedCourses;
