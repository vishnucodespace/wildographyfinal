const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // The user who receives the notification
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Type of notification (e.g., "follow_request")
  type: { type: String, required: true },
  // The notification message
  message: { type: String, required: true },
  // The user who initiated the notification (e.g., the follower)
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Date of the notification
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
