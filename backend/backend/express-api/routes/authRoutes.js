const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// ✅ Google SSO Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth2 callback with JWT generation and redirect
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    try {
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.redirect(`${frontendURL}/dashboard?token=${token}`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

// Protected route example
router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to the dashboard!",
    user: req.user, // Access the decoded user information
  });
});

// ✅ Add this after your other routes
router.get("/", (req, res) => {
  res.send("HR Rewards Backend Running 🚀");
});

router.get("/auth/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user: req.user,
    });
  } else {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
});

module.exports = router;

// React component code
useEffect(() => {
  console.log("Fetching user info from:", `${API_URL}/auth/login/success`);
  fetch(`${API_URL}/auth/login/success`, {
    method: "GET",
    credentials: "include", // Important for sending session cookies
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((res) => {
      console.log("User info from Google SSO:", res);
      setUser(res.user); // or res.data depending on your backend response
    })
    .catch((err) => {
      console.error("Google SSO login failed", err);
    });
}, []);
