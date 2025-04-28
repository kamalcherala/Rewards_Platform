const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateRegisterInput } = require("../utils/validateInput");

// Register a new user
exports.register = async (req, res) => {
  console.log("Registration request received:", req.body);

  try {
    const { name, email, password } = req.body;

    // Validate input
    const validationError = validateRegisterInput(name, email, password);
    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({ message: validationError });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password});
    await user.save();

    console.log("User registered successfully:", { id: user._id, email });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Login a user
exports.login = async (req, res) => {
  console.log("Login attempt received");
  console.log("Request body:", req.body);
  console.log("Headers:", req.headers);

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      console.warn("Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : null);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

   
const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful:", email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Validate JWT and return user info
exports.validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (err) {
    console.error("Token validation error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
