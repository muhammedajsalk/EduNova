const rateLimit = require('express-rate-limit');

const apiLimiterGlobally = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false, 
});

module.exports=apiLimiterGlobally
