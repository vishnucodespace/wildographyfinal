import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Avatar,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

// Animation variants for profile header
const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
};

const ViewProfile = () => {
  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch profile and posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        const userPosts = data.filter((post) => String(post.userId) === String(userId));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [userId]);

  // Set follow state
  useEffect(() => {
    if (profile && currentUser) {
      if (currentUser.following && currentUser.following.includes(profile._id)) {
        setIsFollowing(true);
      }
    }
  }, [profile, currentUser]);

  const token = localStorage.getItem("token");

  // Handle follow request
  const handleFollowRequest = async () => {
    if (!currentUser) {
      console.error("currentUser is undefined");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/follow-request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId: currentUser._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsRequested(true);
      } else {
        console.error("Error sending follow request:", data.error);
      }
    } catch (error) {
      console.error("Error sending follow request:", error);
    }
  };

  // Handle unfollow
  const handleUnfollow = async () => {
    if (!currentUser) {
      console.error("currentUser is undefined");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/unfollow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId: currentUser._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsFollowing(false);
      } else {
        console.error("Error unfollowing user:", data.error);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* Profile Header */}
      <motion.div variants={headerVariants} initial="hidden" animate="visible">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 5,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar
            src={profile.avatar}
            sx={{
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              mr: 3,
              border: (theme) => `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {profile.username || profile.name || 'User'}
            </Typography>
            {profile.bio && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontStyle: 'italic', mb: 2 }}
              >
                {profile.bio}
              </Typography>
            )}
            {/* Follow/Unfollow Button */}
            {currentUser && currentUser._id !== profile._id && (
              <Box sx={{ mt: 2 }}>
                {isFollowing ? (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleUnfollow}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: 'error.dark',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    Unfollow
                  </Button>
                ) : isRequested ? (
                  <Button
                    variant="outlined"
                    disabled
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      color: 'text.disabled',
                      borderColor: 'divider',
                    }}
                  >
                    Requested
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFollowRequest}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    Follow
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>

      <Divider sx={{ mb: 4, bgcolor: 'divider' }} />

      {/* Posts Section */}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 600,
          color: 'text.primary',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -6,
            left: 0,
            width: 40,
            height: 2,
            bgcolor: 'primary.main',
          },
        }}
      >
        Posts
      </Typography>

      {posts.length > 0 ? (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item key={post._id || post.id} xs={12} sm={6} md={4}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  <CardMedia
                    component="img"
                    image={post.img}
                    alt={post.title}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  />
                  <CardContent sx={{ py: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 500, color: 'text.primary' }}
                    >
                      {post.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 3, bgcolor: 'background.paper', borderRadius: 2 }}
        >
          No posts available.
        </Typography>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={(updatedPost) => {
            setPosts((prevPosts) =>
              prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
            );
          }}
          currentUser={currentUser}
        />
      )}
    </Container>
  );
};

export default ViewProfile;