// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Retrieve all users (excluding passwords)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
