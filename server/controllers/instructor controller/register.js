const instructorModel = require('../../models/instructorModel')
const bcrypt=require('bcryptjs')

async function register(req, res) {
    try {
        const { name, email, password, bio, phone, skills, linkedInProfile } = req.body;

        const skillsArray=skills.split(',')

        const avatarUrl = req.files?.avatar?.[0]?.path;
        const demoVideoUrl = req.files?.demoVideo?.[0]?.path;
 
        const hashedPassword=await bcrypt.hash(password,10)

        const documents = {
            degreeCertificate: req.files?.degreeCertificate?.[0]?.path,
            experienceLetter: req.files?.experienceLetter?.[0]?.path,
            certification: req.files?.certification?.[0]?.path,
            idProof: req.files?.idProof?.[0]?.path,
        };
        const instractor = await instructorModel.findOne({ email })
        instractor.name = name,
        instractor.email = email,
        instractor.phone = phone,
        instractor.password = hashedPassword,
        instractor.bio = bio,
        instractor.skills = skillsArray,
        instractor.linkedInProfile = linkedInProfile,
        instractor.avatar = avatarUrl,
        instractor.demoVideo = demoVideoUrl,
        instractor.documents.degreeCertificate = documents.degreeCertificate,
        instractor.documents.experienceLetter = documents.experienceLetter,
        instractor.documents.certification = documents.certification,
        instractor.documents.idProof = documents.idProof,
        instractor.approved = false,
        instractor.otp = null,
        instractor.otpExpiry = null,
        instractor.resetToken = null,
        instractor.resetTokenExpiry = null,
        instractor.verificationStatus = "pending"

        await instractor.save()

        res.status(200).json({ success: true, message: "the instructor registration form is submited,please wait 24hr varification your details" })
    } catch (error) {
        res.status(500).json({ success: true, message: "the server side erorr" })
        console.log(error)
    }
}

module.exports = register