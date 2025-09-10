const jwt = require("jsonwebtoken");

const verifySocketJWT = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      const err = new Error("Authentication error: Token required");
      err.data = { content: "Please provide a valid token" };
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    const err = new Error("Authentication error");
    err.data = { content: "Invalid token" };
    return next(err);
  }
};

module.exports = verifySocketJWT;
