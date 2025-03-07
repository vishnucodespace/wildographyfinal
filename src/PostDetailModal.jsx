import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  CardMedia,
  Divider,
  TextField,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL||'http://localhost:5174';

// Animation variants (updated for consistency with HomeGrid/ExplorePage)
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
  exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const fullScreenVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

const PostDetailModal = ({ post, onClose, onPostUpdated, currentUser }) => {
  const [localPost, setLocalPost] = useState(post);
  const [commentText, setCommentText] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalPost(post);
    console.log("PostDetailModal rendered with post:", post); // Debug to verify props
    console.log("Modal container zIndex check:", document.querySelector('.MuiModal-root')?.style.zIndex); // Debug zIndex
  }, [post]);

  const commenterName = currentUser?.username || currentUser?.name || "Anonymous";
  const token = localStorage.getItem("token");

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${localPost._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
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
      const response = await fetch(`${API_URL}/api/posts/${localPost._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

  const posterAvatar = localPost.userAvatar || "https://via.placeholder.com/40";
  const posterUsername = localPost.username || "Unknown User";

  const uploadDate = localPost.createdAt
    ? new Date(localPost.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : "Date not available";

  const handleProfileClick = () => {
    navigate(`/viewprofile/${localPost.userId}`, { state: { currentUser } });
  };

  const handleImageClick = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      {/* Main Modal with Cancel Button */}
      <Modal
        open={Boolean(localPost) && !isFullScreen}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'none', // Removed blur for a clean backdrop
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Subtle semi-transparent backdrop
          border: 'none',
          outline: 'none',
          boxShadow: 'none', // Remove any shadow that might mimic a container
          '&:focus': { outline: 'none', border: 'none' }, // Prevent focus outlines/borders
          zIndex: 1300, // Ensure modal is above background content
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ position: 'relative', zIndex: 1301 }} // Ensure content is above backdrop
        >
          <Box
            sx={{
              width: { xs: '95%', md: '85%' },
              maxWidth: 1200,
              bgcolor: 'background.paper',
              borderRadius: 0, // Removed rounded borders as requested
              overflow: 'hidden',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              maxHeight: '90vh',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)', // Reduced shadow for a cleaner look
              border: 'none',
              outline: 'none',
              '&:focus': { outline: 'none', border: 'none' }, // Prevent focus outlines/borders
              zIndex: 1302, // Ensure Box is above motion div
              transition: 'all 0.3s ease-in-out', // Smooth transitions for Pexels-like feel
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)', // Subtle hover shadow
              },
            }}
          >
            {/* Cancel Button for Main Modal */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#2c3e50', // Consistent with HomeGrid/ExplorePage
                '&:hover': { color: '#27ae60', transform: 'scale(1.1)', bgcolor: 'rgba(255,255,255,0.9)' }, // Smooth hover with slight background
                zIndex: 1303, // Highest zIndex to ensure visibility
                border: 'none',
                outline: 'none',
                '&:focus': { outline: 'none', border: 'none' }, // Prevent focus outlines/borders
                borderRadius: 0, // Removed rounded border for consistency
                p: 1, // Padding for a larger hit area
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Media Section (Adjusted Alignment) */}
            <Box
              sx={{
                flex: { xs: 'none', md: 1.5 },
                display: 'flex',
                justifyContent: 'center', // Centered alignment for better presentation
                alignItems: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                '&:focus': { outline: 'none', border: 'none' }, // Prevent focus outlines/borders
                zIndex: 1300, // Keep it below the cancel button
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)', // Slight scale on hover for interactivity
                },
              }}
              onClick={handleImageClick}
            >
              <CardMedia
                component="img"
                image={localPost.img}
                alt={localPost.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  maxHeight: { xs: '50vh', md: '70vh' },
                  objectFit: 'contain', // Flexible scaling, centered for better alignment
                  border: 'none',
                  outline: 'none',
                  '&:focus': { outline: 'none', border: 'none' }, // Prevent focus outlines/borders
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)', // Slight scale on hover for Pexels-like interactivity
                  },
                }}
              />
            </Box>

            {/* Details Section */}
            <Box
              sx={{
                flex: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                border: 'none',
                outline: 'none',
                '&:focus': { outline: 'none', border: 'none' }, // Prevent focus outlines/borders
                zIndex: 1300, // Keep it below the cancel button
                borderRadius: 0, // Removed rounded borders as requested
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)', // Subtle inner shadow for depth
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <motion.div variants={itemVariants} initial="hidden" animate="visible" whileHover="hover">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }} onClick={handleProfileClick}>
                  <Avatar
                    src={posterAvatar}
                    alt={posterUsername}
                    sx={{
                      width: 48, // Larger for prominence
                      height: 48,
                      mr: 2,
                      border: '2px solid #27ae60', // Green border for HomeGrid consistency
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(39, 174, 96, 0.2)',
                      },
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Roboto", sans-serif',
                      fontWeight: 600,
                      color: '#2c3e50',
                      transition: 'color 0.3s ease',
                      '&:hover': { color: '#27ae60' },
                    }}
                  >
                    {posterUsername}
                  </Typography>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" whileHover="hover">
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: 700,
                    color: '#2c3e50',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
                    transition: 'color 0.3s ease',
                    '&:hover': { color: '#27ae60' },
                  }}
                >
                  {localPost.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontFamily: '"Roboto", sans-serif',
                    color: '#2c3e50',
                    lineHeight: 1.6,
                  }}
                >
                  {localPost.description}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    fontFamily: '"Roboto", sans-serif',
                    color: '#666666',
                    fontStyle: 'italic',
                  }}
                >
                  Posted on {uploadDate}
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" whileHover="hover">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={handleLike}
                      sx={{
                        color: 'error.main',
                        '&:hover': { color: '#27ae60', transform: 'scale(1.1)' },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        fontFamily: '"Roboto", sans-serif',
                        color: '#2c3e50',
                        transition: 'color 0.3s ease',
                        '&:hover': { color: '#27ae60' },
                      }}
                    >
                      {localPost.likes || 0} Likes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      sx={{
                        color: '#2c3e50',
                        '&:hover': { color: '#27ae60', transform: 'scale(1.1)' },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        fontFamily: '"Roboto", sans-serif',
                        color: '#2c3e50',
                        transition: 'color 0.3s ease',
                        '&:hover': { color: '#27ae60' },
                      }}
                    >
                      {localPost.comments?.length || 0} Comments
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <Divider
                sx={{
                  my: 2,
                  bgcolor: '#e0e0e0',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#27ae60', opacity: 0.5 },
                }}
              />

              <motion.div variants={itemVariants} initial="hidden" animate="visible" whileHover="hover">
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: 600,
                    color: '#2c3e50',
                    transition: 'color 0.3s ease',
                    '&:hover': { color: '#27ae60' },
                  }}
                >
                  Comments
                </Typography>
                <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 250, mb: 2, pr: 1 }}>
                  {localPost.comments && localPost.comments.length > 0 ? (
                    localPost.comments.map((comment, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                      >
                        <Box
                          sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: '#ffffff',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #e9ecef',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar
                              src={comment.userAvatar || "https://via.placeholder.com/32"}
                              alt={comment.user}
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                border: '1px solid #27ae60',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 2px 8px rgba(39, 174, 96, 0.2)',
                                },
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontFamily: '"Roboto", sans-serif',
                                fontWeight: 500,
                                color: '#2c3e50',
                                transition: 'color 0.3s ease',
                                '&:hover': { color: '#27ae60' },
                              }}
                            >
                              {comment.user}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Roboto", sans-serif',
                              color: '#666666',
                              lineHeight: 0.2,
                              wordBreak: 'break-word',
                            }}
                          >
                            {comment.text}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Roboto", sans-serif',
                        color: '#666666',
                        fontStyle: 'italic',
                      }}
                    >
                      No comments yet.
                    </Typography>
                  )}
                </Box>
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" whileHover="hover">
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label="Add a comment..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        bgcolor: 'background.paper',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease-in-out',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                          borderColor: '#27ae60',
                          transform: 'translateY(-2px)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 6px 20px rgba(39, 174, 96, 0.2)',
                          borderColor: '#27ae60',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#2c3e50',
                        fontFamily: '"Roboto", sans-serif',
                        fontWeight: 500,
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: '"Roboto", sans-serif',
                        color: '#2c3e50',
                        padding: '12px 14px',
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    sx={{
                      borderRadius: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(39, 174, 96, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      fontFamily: '"Roboto", sans-serif',
                      fontWeight: 600,
                      padding: '8px 20px',
                      border: '1px solid #27ae60',
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Modal>

      {/* Full-Screen Image Modal with Cancel Button */}
      {isFullScreen && (
        <Modal
          open={isFullScreen}
          onClose={handleCloseFullScreen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            '&:focus': { outline: 'none', border: 'none' },
            zIndex: 1400,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
              outline: 'none',
              zIndex: 1401,
            }}
          >
            <motion.div
              variants={fullScreenVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%', height: '100%' }}
              onClick={handleCloseFullScreen}
            >
              <CardMedia
                component="img"
                image={localPost.img}
                alt={localPost.title}
                sx={{
                  width: 'auto',
                  height: '100vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  '&:focus': { outline: 'none', border: 'none' },
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              />
            </motion.div>

            {/* Cancel Button for Full-Screen Modal */}
            <IconButton
              onClick={handleCloseFullScreen}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#2c3e50',
                '&:hover': { color: '#27ae60', transform: 'scale(1.1)', bgcolor: 'rgba(255,255,255,0.9)' },
                zIndex: 1402,
                border: 'none',
                outline: 'none',
                '&:focus': { outline: 'none', border: 'none' },
                borderRadius: 0,
                p: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PostDetailModal;
