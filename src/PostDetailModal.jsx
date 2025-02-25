// src/components/PostDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Modal, IconButton, Typography, CardMedia, Divider, 
  TextField, Button, Avatar 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';

const PostDetailModal = ({ post, onClose, onPostUpdated, currentUser }) => {
  const [localPost, setLocalPost] = useState(post);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();

  // Update local post state when post prop changes
  useEffect(() => {
    setLocalPost(post);
    console.log("PostDetailModal: post data:", post);
  }, [post]);

  // Use currentUser for comment if available
  const commenterName = currentUser?.username || currentUser?.name || "Anonymous";

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5174/api/posts/${localPost._id}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        const updatedPost = { ...localPost, likes: data.likes };
        setLocalPost(updatedPost);
        onPostUpdated && onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await fetch(`http://localhost:5174/api/posts/${localPost._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: commenterName, text: commentText }),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedPost = { ...localPost, comments: data.post.comments };
        setLocalPost(updatedPost);
        onPostUpdated && onPostUpdated(updatedPost);
        setCommentText('');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Use the poster's data from the post object
  const posterAvatar = localPost.userAvatar || "https://via.placeholder.com/40";
  const posterUsername = localPost.username || "Unknown User";

  const handleProfileClick = () => {
    navigate(`/viewprofile/${localPost.userId}`,{ state: { currentUser } });
  };

  return (
    <Modal open={Boolean(localPost)} onClose={onClose} sx={{ backdropFilter: 'blur(8px)' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', md: '80%' },
            maxWidth: 1000,
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            maxHeight: '90vh',
          }}
        >
          {/* Close Button */}
          <IconButton 
            onClick={onClose}
            sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
          >
            <CloseIcon />
          </IconButton>
          {/* Media Section */}
          <Box sx={{ flex: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardMedia
              component="img"
              image={localPost.img}
              alt={localPost.title}
              sx={{ width: '100%', maxHeight: '60vh', objectFit: 'cover' }}
            />
          </Box>
          {/* Details Section */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Poster Profile Section */}
            <Box 
              sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }} 
              onClick={handleProfileClick}
            >
              <Avatar src={posterAvatar} alt={posterUsername} sx={{ width: 40, height: 40, mr: 1 }} />
              <Typography variant="subtitle1">{posterUsername}</Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 2 }}>{localPost.title}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{localPost.description}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={handleLike}>
                <FavoriteIcon color="error" />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>{localPost.likes || 0} Likes</Typography>
              <IconButton sx={{ ml: 2 }}>
                <ChatBubbleOutlineIcon />
              </IconButton>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Comments</Typography>
            <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 200, mb: 2 }}>
              {localPost.comments && localPost.comments.length > 0 ? (
                localPost.comments.map((comment, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">{comment.user}:</Typography>
                    <Typography variant="body2">{comment.text}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="Add a comment..."
                variant="outlined"
                fullWidth
                size="small"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddComment}>Post</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PostDetailModal;
