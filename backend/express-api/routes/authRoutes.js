const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middleware/authMiddleware")
const { register, login, validateToken } = require("../controllers/authController");

console.log("✅ authRoutes loaded");

// Auth routes
router.post("/login", login); // 👈 Already inside /api/auth
router.post("/register", register); 
router.get("/validate", validateToken);

router.get("/me", jwtMiddleware, validateToken);


module.exports = router;
