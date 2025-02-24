import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Modal,
  TextField,
  Container,
  Divider,
} from '@mui/material';
import PostDetailModal from './PostDetailModal';

const ProfilePage = ({ user, setUser }) => {
  const [posts, setPosts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const [editData, setEditData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/posts');
        const data = await response.json();
        const userPosts = data.filter((post) =>
          String(post.userId) === String(user?._id)
        );
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleEditOpen = () => {
    setErrorMessage('');
    setEditData({
      username: user?.username || '',
      avatar: user?.avatar || '',
    });
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:5174/api/auth/updateProfile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          ...editData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        handleEditClose();
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Error updating profile. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const blueButtonSx = {
    backgroundColor: "#1976d2",
    "&:hover": { backgroundColor: "#115293" },
    textTransform: "none",
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 120, height: 120, mr: 3, border: '3px solid #f0f0f0' }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {user.username || "Not set"}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" sx={blueButtonSx} size="small">
                Posts: {posts.length}
              </Button>
              <Button variant="contained" sx={blueButtonSx} size="small">
                Followers: {user.followersCount || 0}
              </Button>
              <Button variant="contained" sx={blueButtonSx} size="small">
                Following: {user.followingCount || 0}
              </Button>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: blueButtonSx.backgroundColor }}>
                Troop: {user.troop}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" sx={blueButtonSx} size="medium" onClick={handleEditOpen}>
                Edit Profile
              </Button>
            </Box>
          </Box>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Button variant="contained" sx={blueButtonSx} size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        My Posts
      </Typography>
      {posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item key={post._id || post.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' },
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPost(post)}
              >
                <CardMedia
                  component="img"
                  image={post.img}
                  alt={post.title}
                  sx={{ height: 250, objectFit: 'cover' }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {post.title}
                  </Typography>
                  {post.description && (
                    <Typography variant="body2" color="text.secondary">
                      {post.description}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ mt: 2, color: 'gray', textAlign: 'center' }}>
          No posts yet.
        </Typography>
      )}

      {selectedPost && (
        <Modal open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)}>
          <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </Modal>
      )}

      <Modal open={editOpen} onClose={handleEditClose}>
        <Box
          sx={{
            p: 4,
            width: { xs: '90%', sm: 400 },
            mx: 'auto',
            mt: '20vh',
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Profile
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            Name: {user.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Email: {user.email}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: blueButtonSx.backgroundColor }}>
            Troop: {user.troop}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={editData.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Profile Image URL"
            name="avatar"
            value={editData.avatar}
            onChange={handleChange}
          />
          {errorMessage && (
            <Typography variant="body2" sx={{ mt: 1, color: 'red' }}>
              {errorMessage}
            </Typography>
          )}
          <Button variant="contained" fullWidth sx={{ mt: 2, ...blueButtonSx }} onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
