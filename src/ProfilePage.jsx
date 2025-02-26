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
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PostDetailModal from './PostDetailModal';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ user, setUser }) => {
  const [posts, setPosts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '',
  });
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  // Fetch posts created by the user
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

  // Re-fetch current user data to update followers/following counts
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5174/api/users/current', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        console.error('Failed to fetch updated user data.');
      }
    } catch (error) {
      console.error('Error fetching updated user:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  // Fetch followers when modal opens
  useEffect(() => {
    if (openFollowers && user) {
      const fetchFollowers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5174/api/users/${user._id}/followers`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setFollowers(data);
          } else {
            console.error('Failed to fetch followers.');
          }
        } catch (error) {
          console.error('Error fetching followers:', error);
        }
      };
      fetchFollowers();
    }
  }, [openFollowers, user]);

  // Fetch following when modal opens
  useEffect(() => {
    if (openFollowing && user) {
      const fetchFollowing = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5174/api/users/${user._id}/following`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setFollowing(data);
          } else {
            console.error('Failed to fetch following.');
          }
        } catch (error) {
          console.error('Error fetching following:', error);
        }
      };
      fetchFollowing();
    }
  }, [openFollowing, user]);

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
      console.error('Error updating profile:', error);
      setErrorMessage('Error updating profile. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5174/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setPosts(posts.filter((post) => (post._id || post.id) !== postId));
      } else {
        const data = await response.json();
        alert(`Failed to delete post: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  const blueButtonSx = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderRadius: 2,
    padding: '8px 16px',
    textTransform: 'none',
    fontWeight: 500,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      bgcolor: 'primary.dark',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    transition: 'all 0.2s ease',
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          },
          transition: 'box-shadow 0.3s ease',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Avatar
            src={user.avatar}
            sx={{ 
              width: { xs: 100, sm: 120 }, 
              height: { xs: 100, sm: 120 }, 
              mr: { sm: 3 }, 
              mb: { xs: 2, sm: 0 },
              border: (theme) => `3px solid ${theme.palette.divider}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 2 
              }}
            >
              {user.username || 'Not set'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
              <Button variant="contained" sx={blueButtonSx} size="small">
                Posts: {posts.length}
              </Button>
              <Button 
                variant="contained" 
                sx={blueButtonSx} 
                size="small" 
                onClick={() => setOpenFollowers(true)}
              >
                Followers: {user.followers ? user.followers.length : 0}
              </Button>
              <Button 
                variant="contained" 
                sx={blueButtonSx} 
                size="small" 
                onClick={() => setOpenFollowing(true)}
              >
                Following: {user.following ? user.following.length : 0}
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500, 
                  color: 'primary.main',
                  letterSpacing: '0.2px' 
                }}
              >
                Troop: {user.troop}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                sx={blueButtonSx} 
                size="medium" 
                onClick={handleEditOpen}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
          <Box sx={{ position: { sm: 'absolute' }, top: { sm: 16 }, right: { sm: 16 }, mt: { xs: 2, sm: 0 } }}>
            <Button 
              variant="contained" 
              sx={blueButtonSx} 
              size="small" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
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
          }
        }}
      >
        My Posts
      </Typography>
      {posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item key={post._id || post.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  boxShadow: '0 3px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  position: 'relative',
                }}
                onClick={() => setSelectedPost(post)}
              >
                <CardMedia
                  component="img"
                  image={post.img}
                  alt={post.title}
                  sx={{ 
                    height: 250, 
                    objectFit: 'cover',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: 'text.primary' 
                    }}
                  >
                    {post.title}
                  </Typography>
                  {post.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mt: 1 
                      }}
                    >
                      {post.description}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)',
                    '&:hover': { 
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : '#ffffff',
                      color: 'error.main',
                    },
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post._id || post.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            color: 'text.secondary', 
            textAlign: 'center',
            py: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        >
          No posts yet.
        </Typography>
      )}

      {selectedPost && (
        <Modal open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)}>
          <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} currentUser={user} />
        </Modal>
      )}

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Box
          sx={{
            p: 4,
            width: { xs: '90%', sm: 400 },
            mx: 'auto',
            mt: '20vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              fontWeight: 500,
              color: 'text.primary' 
            }}
          >
            Edit Profile
          </Typography>
          <Divider sx={{ mb: 2, opacity: 0.6 }} />
          <Typography 
            variant="body2" 
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Name: {user.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Email: {user.email}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              fontWeight: 500, 
              color: 'primary.main' 
            }}
          >
            Troop: {user.troop}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={editData.username}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.default',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
                '&.Mui-focused': { color: 'primary.main' },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Profile Image URL"
            name="avatar"
            value={editData.avatar}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.default',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
                '&.Mui-focused': { color: 'primary.main' },
              },
            }}
          />
          {errorMessage && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                color: 'error.main',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                p: 1,
                borderRadius: 1,
              }}
            >
              {errorMessage}
            </Typography>
          )}
          <Button 
            variant="contained" 
            fullWidth 
            sx={[blueButtonSx, { mt: 2 }]} 
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* Followers Modal */}
      <Modal open={openFollowers} onClose={() => setOpenFollowers(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontWeight: 500, color: 'text.primary' }}
          >
            Followers
          </Typography>
          {followers.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No followers found.
            </Typography>
          ) : (
            <List>
              {followers.map((follower) => (
                <ListItem 
                  key={follower._id} 
                  divider
                  sx={{ 
                    '&:hover': { bgcolor: 'background.default' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={follower.avatar} alt={follower.username || follower.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={follower.username || follower.name}
                    secondary={follower.email}
                    primaryTypographyProps={{ color: 'text.primary', fontWeight: 500 }}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(`/viewprofile/${follower._id}`)}
                    sx={{
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(66,165,245,0.1)' : '#f0f7ff',
                        borderColor: 'primary.dark',
                      },
                    }}
                  >
                    View Profile
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>

      {/* Following Modal */}
      <Modal open={openFollowing} onClose={() => setOpenFollowing(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontWeight: 500, color: 'text.primary' }}
          >
            Following
          </Typography>
          {following.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Not following anyone.
            </Typography>
          ) : (
            <List>
              {following.map((followed) => (
                <ListItem 
                  key={followed._id} 
                  divider
                  sx={{ 
                    '&:hover': { bgcolor: 'background.default' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={followed.avatar} alt={followed.username || followed.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={followed.username || followed.name}
                    secondary={followed.email}
                    primaryTypographyProps={{ color: 'text.primary', fontWeight: 500 }}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(`/viewprofile/${followed._id}`)}
                    sx={{
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(66,165,245,0.1)' : '#f0f7ff',
                        borderColor: 'primary.dark',
                      },
                    }}
                  >
                    View Profile
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProfilePage;