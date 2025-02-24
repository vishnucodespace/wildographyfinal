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

// GET /api/users/:id - Retrieve a single user by ID (excluding password)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
