const instructorModel = require("../../models/instructorModel")
const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function approveOrReject(req, res) {
    try {
        const body = req.body
        const instructor = await instructorModel.findById(body.id)
        if (body.verificationStatus === "rejected") {
            instructor.verificationStatus = "rejected"
            instructor.rejectionReason = body.rejectionReason
            await instructor.save()
            await transporter.sendMail({
                to: body.email,
                subject: "Instructor Verification Unsuccessful",
                html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff3f3;">
      <div style="text-align: center;">
        <img src="https://media.istockphoto.com/id/949546382/vector/rejected-ink-stamp.jpg?s=612x612&w=0&k=20&c=S8MRCa7JMK7cSNvQwflyDLyMzXAZ3ng3vRw7rVP9eNU=" alt="Rejected" style="margin-bottom: 20px;" />
        <h2 style="color: #d32f2f;">Verification Unsuccessful</h2>
      </div>

      <p style="font-size: 16px; color: #444;">Dear Instructor,</p>
      
      <p style="font-size: 16px; color: #444;">
        We regret to inform you that your <strong>instructor verification</strong> could not be completed at this time.
      </p>

      <p style="font-size: 16px; color: #444;">
        Possible reasons may include missing or invalid documentation, or issues with the submitted content. We encourage you to review your information and try again.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/register" style="background-color: #d32f2f; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Reapply Now
        </a>
      </div>

      <p style="font-size: 14px; color: #999;">
        If you believe this decision was made in error or need further clarification, feel free to contact our support team.
      </p>

      <p style="font-size: 14px; color: #444;">
        Best regards,<br/>
        <strong>EduNova Support Team</strong>
      </p>
    </div>
  `
            });

            return res.status(200).json({ success: true, message: "instructor rejected succefully" })
        }
        instructor.verificationStatus = "approved"
        instructor.isActive=true
        await instructor.save()
        await transporter.sendMail({
            to: body.email,
            subject: "Instructor Verification Successful - Welcome Aboard!",
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <div style="text-align: center;">
        <img src="https://media.istockphoto.com/id/948531554/vector/approved-ink-stamp.jpg?s=612x612&w=0&k=20&c=kVKJxtXo1QOxDoqTvAdxHEjuVlcRvxGN-1f6qvyimRA=" alt="Success" style="margin-bottom: 20px;" />
        <h2 style="color: #2E7D32;">Verification Successful!</h2>
      </div>

      <p style="font-size: 16px; color: #444;">Dear Instructor,</p>
      
      <p style="font-size: 16px; color: #444;">
        We are pleased to inform you that your <strong>instructor verification</strong> has been successfully completed. Your profile is now live, and you can access your dashboard and start managing your courses.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/login" style="background-color: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Log In Now
        </a>
      </div>

      <p style="font-size: 14px; color: #999;">
        If you have any questions or need assistance, feel free to reach out to our support team.
      </p>

      <p style="font-size: 14px; color: #444;">
        Best regards,<br/>
        <strong>EduNova Support Team</strong>
      </p>
    </div>
  `
        });

        res.status(200).json({ success: true, message: "instructor approved succefully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports = approveOrReject