const jwt = require('jsonwebtoken')
require('dotenv').config()

async function jwtAuth(req, res, next) {
    try {
        const token=req.cookies.accesTokken
        if (!token) {
            req.user = null;
            return res.status(400).json("please login")
        }
        jwt.verify(token, process.env.JWT_SECRET_CODE, (error, decode) => {
            if (error) return res.status(400).json({ success: false, message: "token is invalid" })
            req.user = decode
            next()
        })
    } catch (error) {
        res.status(400).json({ success: false, message: "server side error" })
        console.log(error)
    }
}

async function roleConform(...role) {
    return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role '${req.user.role}' not authorized` });
    }
    next();
    }
}

module.exports={jwtAuth,roleConform}