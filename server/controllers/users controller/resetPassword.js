const userModel = require("../../models/usersModel")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
require('dotenv').config()


async function resetPassword(req, res) {
    try {
        const { token,password } = req.body
        if (!token) return res.status(404).json({ success: false, message: "token is missing" })
        jwt.verify(token, process.env.JWT_SECRET_CODE,(error,decode)=>{
           if(error) return res.status(404).json({ success: false, message: "Invalid or expired token" })
           req.user=decode
        })
        const user = await userModel.findById(req.user.id)
        if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()
        res.status(200).json({ success: true, message: "Password reset successful. You can now log in." })
    } catch (err) {
        res.status(400).json({ message: "server side error" });
        console.log(err)
    }

}

module.exports=resetPassword