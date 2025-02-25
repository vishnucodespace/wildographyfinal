const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications?userId=<userId> - Retrieve notifications for a specific user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const notifications = await Notification.find({ userId }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
