const CourseModel = require("../../models/courseModel");

async function courseCreate(req, res) {
  try {
    const { title, category, description, thumbnail, curriculum } = req.body.payload;
    const newCourse = new CourseModel({
      title,
      description,
      category,
      thumbnail,
      curriculum: curriculum.map(section => ({
        section: section.section,
        lectures: section.lectures.map(lecture => ({
          title: lecture.title,
          url: lecture.file,
          duration: lecture.duration,
        }))
      })),
      instructorId: req.user.id 
    });

    await newCourse.save();
    res.status(201).json({ success: true, message:"you succefully created course" });
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(400).json({ success: false, error });
  }
}

module.exports=courseCreate