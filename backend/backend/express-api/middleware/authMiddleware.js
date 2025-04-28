// filepath: c:\Users\kamal\Desktop\RewardsPlatform\backend\backend\express-api\middleware\authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization); // Debugging log

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging log
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // Debugging log
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;