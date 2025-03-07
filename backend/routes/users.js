const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const requireAuth = require('../middleware/requireAuth');

router.get('/current', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/follow', requireAuth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const followerUser = await User.findById(req.user.userId);
    if (!targetUser || !followerUser) return res.status(404).json({ error: 'User not found' });
    if (targetUser.followers.includes(followerUser.id)) return res.status(400).json({ error: 'Already following' });
    targetUser.followers.push(followerUser.id);
    followerUser.following.push(targetUser.id);
    await targetUser.save();
    await followerUser.save();
    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/unfollow', requireAuth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const followerUser = await User.findById(req.user.userId);
    if (!targetUser || !followerUser) return res.status(404).json({ error: 'User not found' });
    if (!targetUser.followers.includes(followerUser.id)) return res.status(400).json({ error: 'Not following' });
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== followerUser.id);
    followerUser.following = followerUser.following.filter(id => id.toString() !== targetUser.id);
    await targetUser.save();
    await followerUser.save();
    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/follow-request', requireAuth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const followerUser = await User.findById(req.user.userId);
    if (!targetUser || !followerUser) return res.status(404).json({ error: 'User not found' });
    const newNotification = new Notification({
      userId: targetUser.id,
      type: 'follow_request',
      message: `${followerUser.username || followerUser.name} has requested to follow you.`,
      fromUser: followerUser.id
    });
    await newNotification.save();
    res.json({ message: 'Follow request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/accept-follow-request', requireAuth, async (req, res) => {
  try {
    const followerUser = await User.findById(req.params.id);
    const targetUser = await User.findById(req.user.userId);
    if (!followerUser || !targetUser) return res.status(404).json({ error: 'User not found' });
    if (!targetUser.followers.includes(followerUser.id)) targetUser.followers.push(followerUser.id);
    if (!followerUser.following.includes(targetUser.id)) followerUser.following.push(targetUser.id);
    await targetUser.save();
    await followerUser.save();
    await Notification.deleteOne({ userId: targetUser.id, fromUser: followerUser.id, type: 'follow_request' });
    res.json({ message: 'Follow request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/reject-follow-request', requireAuth, async (req, res) => {
  try {
    await Notification.deleteOne({ userId: req.user.userId, fromUser: req.params.id, type: 'follow_request' });
    res.json({ message: 'Follow request rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/follow-back', requireAuth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.userId);
    if (!targetUser || !currentUser) return res.status(404).json({ error: 'User not found' });
    if (currentUser.following.includes(targetUser.id)) return res.status(400).json({ error: 'Already following' });
    currentUser.following.push(targetUser.id);
    targetUser.followers.push(currentUser.id);
    await currentUser.save();
    await targetUser.save();
    res.json({ message: 'Followed back successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;