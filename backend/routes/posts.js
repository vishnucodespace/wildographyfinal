const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// POST /api/posts - Create a new post with tag
router.post('/', async (req, res) => {
  const { userId, title, img, description, tag } = req.body;
  if (!img) {
    return res.status(400).json({ error: 'Image URL is required' });
  }
  try {
    const post = new Post({
      userId,
      title: title || 'Untitled Post',
      img,
      description: description || '',
      likes: 0,
      tag: tag || 'Wild'
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/posts - Retrieve all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
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
    // Increment likes (initialize if missing)
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json({ message: "Post liked successfully", likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// POST /api/posts/:id/comment - Add a comment to a post
router.post('/:id/comment', async (req, res) => {
  const postId = req.params.id;
  const { user, text } = req.body; // Expecting the commenter's name (or ID) and comment text
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Initialize comments if missing
    if (!post.comments) {
      post.comments = [];
    }
    // Add the new comment
    post.comments.push({ user, text });
    await post.save();
    res.json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
