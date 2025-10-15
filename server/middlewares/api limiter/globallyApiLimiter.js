const rateLimit = require('express-rate-limit');

const apiLimiterGlobally = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

module.exports = apiLimiterGlobally;
