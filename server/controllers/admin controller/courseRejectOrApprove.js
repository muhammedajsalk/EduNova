const CourseModel = require("../../models/courseModel");
const nodemailer = require("nodemailer");
require('dotenv').config()
const { sendNotification } = require("../../utilis/socketNotification");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function courseApproveOrReject(req, res) {
  try {
    const body = req.body
    const course = await CourseModel.findById(body.id)
    if (body.status === "rejected") {
      course.status = "rejected"
      course.rejectionReason = body.rejectionReason
      await course.save()
      await transporter.sendMail({
        to: body.email,
        subject: "Instructor Course Rejected",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff3f3;">
      <div style="text-align: center;">
        <img src="https://media.istockphoto.com/id/949546382/vector/rejected-ink-stamp.jpg?s=612x612&w=0&k=20&c=S8MRCa7JMK7cSNvQwflyDLyMzXAZ3ng3vRw7rVP9eNU=" alt="Rejected" style="width: 100px; margin-bottom: 20px;" />
        <h2 style="color: #d32f2f;">Course Rejected</h2>
      </div>

      <p style="font-size: 16px; color: #444;">Dear ${body.instructorName},</p>

      <p style="font-size: 16px; color: #444;">
        We regret to inform you that your course titled <strong>"${body.courseTitle}"</strong> did not meet our platform’s approval criteria and has been <strong>rejected</strong>.
      </p>

      <p style="font-size: 16px; color: #444;">
        <strong>Reason for Rejection:</strong><br/>
        <em style="color: #d32f2f;">${body.rejectionReason || "No specific reason provided."}</em>
      </p>

      <p style="font-size: 16px; color: #444;">
        Please review the issue above, make necessary changes, and feel free to reapply. We’re here to support you throughout your journey.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/instructor/courses" style="background-color: #d32f2f; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Edit & Reapply
        </a>
      </div>

      <p style="font-size: 14px; color: #999;">
        If you need more clarification, feel free to reach out to our support team at any time.
      </p>

      <p style="font-size: 14px; color: #444;">
        Best regards,<br/>
        <strong>EduNova Review Team</strong>
      </p>
    </div>
  `
      });

      sendNotification(body.instructorId, {
        userId: body.instructorId,
        type: "error",
        category: "course_application_rejected",
        title: `your course verification rejected`,
        message: `your ${course.title} course verification rejected`,
      })

      return res.status(200).json({ success: true, message: "course rejected succefully" })
    }
    course.status = "approved"
    await course.save()
    await transporter.sendMail({
      to: body.email,
      subject: "Your Course Has Been Approved!",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f3fff5;">
      <div style="text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="Approved" style="width: 100px; margin-bottom: 20px;" />
        <h2 style="color: #388e3c;">Congratulations!</h2>
      </div>

      <p style="font-size: 16px; color: #444;">Dear ${body.instructorName},</p>

      <p style="font-size: 16px; color: #444;">
        We’re thrilled to inform you that your course titled <strong>"${body.courseTitle}"</strong> has been successfully reviewed and <strong>approved</strong> for publishing on our platform!
      </p>

      <p style="font-size: 16px; color: #444;">
        Your knowledge and effort will now help students around the world. You can now view your course live and begin tracking enrollments and student feedback.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/instructor/courses" style="background-color: #388e3c; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          View Course
        </a>
      </div>

      <p style="font-size: 14px; color: #444;">
        Thank you for being a part of <strong>EduNova</strong>. We wish you great success on your teaching journey!
      </p>

      <p style="font-size: 14px; color: #444;">
        Best regards,<br/>
        <strong>EduNova Review Team</strong>
      </p>
    </div>
  `
    });

    sendNotification(body.instructorId, {
        userId: body.instructorId,
        type: "success",
        category: "course_application_accepted",
        title: `your course verification accepted`,
        message: `your ${course.title} course verification accepted`,
      })

    res.status(200).json({ success: true, message: "course approved succefully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "server side error" })
    console.log("server side error: " + error)
  }
}

module.exports = courseApproveOrReject