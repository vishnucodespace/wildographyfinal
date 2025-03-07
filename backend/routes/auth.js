const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, avatar, username, troop } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, avatar, username, troop });

    await newUser.save();
    
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(201).json({ message: "Account created successfully", token, user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "No account found. Please sign up." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ error: "Incorrect email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
});

// Update Profile Route
router.put("/updateProfile", async (req, res) => {
  const { userId, username, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { username, avatar }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
});

module.exports = router;
