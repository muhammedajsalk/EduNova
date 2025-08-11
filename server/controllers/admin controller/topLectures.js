const CourseModel = require("../../models/courseModel");

const topLectures = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const order = req.query.order === "asc" ? "asc" : "desc";
        const sortOrder = order === "asc" ? 1 : -1;

        const pipeline = [
            { $unwind: "$curriculum" },
            { $unwind: "$curriculum.lectures" },
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
                $project: {
                    lectureId: "$curriculum.lectures._id",
                    lectureTitle: "$curriculum.lectures.title",
                    url: "$curriculum.lectures.url",
                    duration: "$curriculum.lectures.duration",
                    totalWatchTime: "$curriculum.lectures.totalWatchTime",
                    like: "$curriculum.lectures.like",
                    courseId: "$_id",
                    courseTitle: "$title",
                    sectionTitle: "$curriculum.section",
                    instructorId: "$instructor._id",
                    instructorName: "$instructor.name",
                    instructorEmail: "$instructor.email"
                }
            },
            {
                $facet: {
                    topWatched: [
                        { $sort: { totalWatchTime: sortOrder } },
                        { $limit: limit }
                    ],
                    topLiked: [
                        { $sort: { like: sortOrder } },
                        { $limit: limit }
                    ]
                }
            }
        ];

        const result = await CourseModel.aggregate(pipeline);
        res.status(200).json({data:result});
    } catch (error) {
        console.error("Error fetching top lectures:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports=topLectures