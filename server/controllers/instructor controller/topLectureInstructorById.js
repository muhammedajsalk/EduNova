const mongoose = require("mongoose");
const CourseModel = require("../../models/courseModel");

const topCoursesByInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = 3;
    const order = "desc";
    const sortOrder = order === "asc" ? 1 : -1;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid instructor ID" });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pipeline = [
      { $match: { instructorId: new mongoose.Types.ObjectId(id),status:"approved" } },

      { $unwind: "$curriculum" },
      { $unwind: "$curriculum.lectures" },

      {
        $addFields: {
          lectureRating: {
            $round: [
              {
                $add: [
                  { $multiply: ["$curriculum.lectures.like", 0.6] },
                  { $multiply: ["$curriculum.lectures.totalWatchTime", 0.4] }
                ]
              },
              1
            ]
          }
        }
      },

      {
        $group: {
          _id: "$_id",
          courseTitle: { $first: "$title" },
          instructorId: { $first: "$instructorId" },
          students: { $first: "$students" },
          avgRating: { $avg: "$lectureRating" },
          totalLikes: { $sum: "$curriculum.lectures.like" },
          totalWatchTime: { $sum: "$curriculum.lectures.totalWatchTime" },
          createdAt: { $first: "$createdAt" }
        }
      },

      {
        $addFields: {
          totalStudents: { $size: "$students" },
          studentsLast7Days: {
            $size: {
              $filter: {
                input: "$students",
                as: "s",
                cond: { $gte: ["$$s.courseStartDate", sevenDaysAgo] }
              }
            }
          }
        }
      },

      {
        $addFields: {
          studentGrowthPercent: {
            $cond: [
              {
                $or: [
                  { $eq: ["$totalStudents", 0] },
                  { $eq: [{ $subtract: ["$totalStudents", "$studentsLast7Days"] }, 0] }
                ]
              },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$studentsLast7Days",
                          { $subtract: ["$totalStudents", "$studentsLast7Days"] }
                        ]
                      },
                      100
                    ]
                  },
                  1
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          rating: { $round: ["$avgRating", 1] }
        }
      },

      { $sort: { avgRating: sortOrder } },
      { $limit: limit }
    ];

    let result = await CourseModel.aggregate(pipeline);

    result = result.map(item => ({
      courseId: item._id,
      courseTitle: item.courseTitle,
      totalLikes: item.totalLikes,
      totalWatchTime: item.totalWatchTime,
      totalStudents: item.totalStudents,
      studentsLast7Days: item.studentsLast7Days,
      studentGrowthPercent: item.studentGrowthPercent,
      rating: item.rating
    }));

    return res.json({data:result});
  } catch (error) {
    console.error("Error fetching top courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = topCoursesByInstructor;
