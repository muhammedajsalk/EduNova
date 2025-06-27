const rateLimit = require('express-rate-limit');


const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,
  message: 'Too many login or register attempts. Try again in 10 minutes.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login or register attempts. Try again in 10 minutes.",
    });
  }
});

const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: 'Too many Google login attempts. Please wait a while.',
  handler:(req,res)=>{
    res.status(429).json({
        success:false,
        message:"Too many Google login attempts. Please wait a while."
    })
  }
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 3,
  message: 'Too many OTP requests. Please try again in 10 minutes.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Please try again in 10 minutes."
    });
  }
});


const courseFetchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});


const instructorRegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many instructor submissions. Try again later.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:'Too many instructor submissions. Try again later.'
    });
  }
});


const studentDashboardLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
});


const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: 'You are sending messages too quickly. Try again later.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'You are sending messages too quickly. Try again later.'
    });
  }
});


const paymentLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 10,
  message: 'Too many subscription/payment attempts. Try again later.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many subscription/payment attempts. Try again later.'
    });
  }
});


const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Admin API rate limit exceeded.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Admin API rate limit exceeded.'
    });
  }
});


const uploadLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: 'Too many uploads. Please slow down.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many uploads. Please slow down.'
    });
  }
});

module.exports = {
  authLimiter,
  googleAuthLimiter,
  otpLimiter,
  courseFetchLimiter,
  instructorRegisterLimiter,
  studentDashboardLimiter,
  chatLimiter,
  paymentLimiter,
  adminLimiter,
  uploadLimiter,
};
