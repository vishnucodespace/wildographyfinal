const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.body);
  next();
});

router.post("/signup", async (req, res) => {
  console.log("Entering /signup route");
  const { name, email, password, avatar, username, troop } = req.body;

  try {
    if (!name || !email || !password || !username) {
      console.log("Missing required fields:", { name, email, password, username });
      return res.status(400).json({ error: "Name, email, password, and username are required" });
    }

    console.log("Signup request:", { name, email, username });

    const existingEmail = await User.findOne({ email });
    console.log("Existing email check:", existingEmail ? existingEmail : "No match");
    if (existingEmail) {
      return res.status(400).json({ error: "This email is already registered" });
    }

    const existingUsername = await User.findOne({ username });
    console.log("Existing username check:", existingUsername ? existingUsername : "No match");
    if (existingUsername) {
      console.log("Username already exists, blocking signup");
      return res.status(400).json({ error: "This username is already taken" });
    }

    const usernameCheck = await User.find({ username });
    console.log("All matching usernames:", usernameCheck);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const newUser = new User({ name, email, password: hashedPassword, avatar, username, troop });
    await newUser.save();
    console.log("New user created:", newUser);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      console.log("Duplicate key error detected:", error.keyPattern);
      if (error.keyPattern.email) {
        return res.status(400).json({ error: "This email is already registered" });
      }
      if (error.keyPattern.username) {
        return res.status(400).json({ error: "This username is already taken" });
      }
    }
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
});

module.exports = router;