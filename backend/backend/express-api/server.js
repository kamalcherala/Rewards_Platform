const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
require("./config/googleAuth");

dotenv.config();
console.log("🔧 Env loaded");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
console.log("🔓 CORS enabled");

app.use(express.json());
console.log("🔄 JSON Middleware loaded");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "testsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);
console.log("🧠 Session middleware active");

app.use(passport.initialize());
app.use(passport.session());
console.log("🔐 Passport initialized");

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
console.log("🛣️ Routes mounted");

// ✅ ONLY ONE app.listen() after DB connection
connectDB()
  .then(() => {
    console.log("🧩 MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, (err) => {
      if (err) {
        console.error("❌ Server failed to start:", err);
        return;
      }
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB fails
  });
