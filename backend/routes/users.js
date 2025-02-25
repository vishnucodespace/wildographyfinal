const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const requireAuth = require('../middleware/requireAuth');

// GET /api/users/current - Return the authenticated user
router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in /api/users/current:", error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// GET all users (excluding passwords)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/follow - Directly follow a user
router.post('/:id/follow', requireAuth, async (req, res) => {
  const targetUserId = req.params.id;
  const followerId = req.user.userId;
  try {
    const targetUser = await User.findById(targetUserId);
    const followerUser = await User.findById(followerId);
    if (!targetUser || !followerUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (targetUser.followers.includes(followerId)) {
      return res.status(400).json({ error: 'Already following' });
    }
    targetUser.followers.push(followerId);
    followerUser.following.push(targetUserId);
    await targetUser.save();
    await followerUser.save();
    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/unfollow - Unfollow a user
router.post('/:id/unfollow', requireAuth, async (req, res) => {
  const targetUserId = req.params.id;
  const followerId = req.user.userId;
  try {
    const targetUser = await User.findById(targetUserId);
    const followerUser = await User.findById(followerId);
    if (!targetUser || !followerUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!targetUser.followers.includes(followerId)) {
      return res.status(400).json({ error: 'Not following' });
    }
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== followerId);
    followerUser.following = followerUser.following.filter(id => id.toString() !== targetUserId);
    await targetUser.save();
    await followerUser.save();
    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/follow-request - Send a follow request (instead of direct follow)
router.post('/:id/follow-request', requireAuth, async (req, res) => {
  const targetUserId = req.params.id;
  const followerId = req.user.userId;
  try {
    const targetUser = await User.findById(targetUserId);
    const followerUser = await User.findById(followerId);
    if (!targetUser || !followerUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Optionally, check for an existing follow request before creating a new one.
    const newNotification = new Notification({
      userId: targetUserId,
      type: 'follow_request',
      message: `${followerUser.username || followerUser.name} has requested to follow you.`,
      fromUser: followerId
    });
    await newNotification.save();
    res.json({ message: 'Follow request sent successfully' });
  } catch (error) {
    console.error("Error sending follow request:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/accept-follow-request - Accept a follow request
// Here, :id is the ID of the user who sent the follow request.
router.post('/:id/accept-follow-request', requireAuth, async (req, res) => {
  const followerId = req.params.id;       // The requester
  const targetUserId = req.user.userId;     // The authenticated user accepting the request
  try {
    const followerUser = await User.findById(followerId);
    const targetUser = await User.findById(targetUserId);
    if (!followerUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Add requester to target's followers if not already present.
    if (!targetUser.followers.includes(followerId)) {
      targetUser.followers.push(followerId);
    }
    // Add target to requester's following if not already present.
    if (!followerUser.following.includes(targetUserId)) {
      followerUser.following.push(targetUserId);
    }
    await targetUser.save();
    await followerUser.save();
    // Remove the follow request notification.
    await Notification.deleteOne({
      userId: targetUserId,
      fromUser: followerId,
      type: 'follow_request'
    });
    res.json({ message: 'Follow request accepted successfully' });
  } catch (error) {
    console.error("Error accepting follow request:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/reject-follow-request - Reject a follow request
// Here, :id is the ID of the user who sent the follow request.
router.post('/:id/reject-follow-request', requireAuth, async (req, res) => {
  const followerId = req.params.id;
  const targetUserId = req.user.userId;
  try {
    // Remove the follow request notification.
    await Notification.deleteOne({
      userId: targetUserId,
      fromUser: followerId,
      type: 'follow_request'
    });
    res.json({ message: 'Follow request rejected successfully' });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/follow-back - Follow back the user who requested to follow you
// Here, :id is the user ID of the requester.
router.post('/:id/follow-back', requireAuth, async (req, res) => {
  const targetUserId = req.params.id;      // The user to follow back
  const currentUserId = req.user.userId;     // The authenticated user
  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // If the current user already follows the target, return an error.
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ error: 'Already following' });
    }
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
    await currentUser.save();
    await targetUser.save();
    res.json({ message: 'Followed back successfully' });
  } catch (error) {
    console.error("Error following back user:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET followers for a user
router.get('/:id/followers', async (req, res) => {
  try {
    // Populate followers with additional user info (excluding password)
    const user = await User.findById(req.params.id).populate('followers', '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.followers);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: 'Server error' });
  }
});
  
// GET following for a user
router.get('/:id/following', async (req, res) => {
  try {
    // Populate following with additional user info (excluding password)
    const user = await User.findById(req.params.id).populate('following', '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.following);
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ error: 'Server error' });
  }
});
  
module.exports = router;
