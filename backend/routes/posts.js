// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); // Ensure User model is imported

// POST /api/posts - Create a new post with poster details and tag
router.post('/', async (req, res) => {
  const { userId, title, img, description, tag } = req.body;
  if (!img) {
    return res.status(400).json({ error: 'Image URL is required' });
  }
  try {
    // Fetch the user details to include in the post
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = new Post({
      userId,
      title: title || 'Untitled Post',
      img,
      description: description || '',
      tag: tag || 'Wild',
      username: user.username,       // Include the poster's username
      userAvatar: user.avatar,       // Include the poster's avatar URL
      likes: 0,
      comments: []
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/posts - Retrieve all posts, sorted by newest first
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts/:id/like - Increment the like count for a post
router.post('/:id/like', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json({ message: "Post liked successfully", likes: post.likes });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/posts/:id/comment - Add a comment to a post
router.post('/:id/comment', async (req, res) => {
  const postId = req.params.id;
  const { user, text } = req.body; // Expect the commenter's name and comment text
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push({ user, text });
    await post.save();
    res.json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/posts/:id - Delete a post by ID
router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await Post.deleteOne({ _id: postId });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;