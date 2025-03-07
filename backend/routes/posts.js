const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
router.post('/', async (req, res) => {
  const { userId, title, img, description, tag } = req.body;
  if (!img) return res.status(400).json({ error: 'Image URL is required' });
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const post = new Post({
      userId,
      title: title || 'Untitled Post',
      img,
      description: description || '',
      tag: tag || 'Wild',
      username: user.username,
      userAvatar: user.avatar,
      likes: 0,
      comments: []
    });
    
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Retrieve all posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json({ message: 'Post liked successfully', likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
  const { user, text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.comments.push({ user, text });
    await post.save();
    res.json({ message: 'Comment added successfully', post });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;