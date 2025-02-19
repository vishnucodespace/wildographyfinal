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
} from '@mui/material';

const ProfilePage = ({ user, setUser }) => {
  const [posts, setPosts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(storedPosts.filter((post) => post.userId === user?.id));
  }, [user]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    handleEditClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* ✅ Profile Header */}
      <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
        <Box>
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="body1">{user.email}</Typography>
          <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={handleEditOpen}>
            Edit Profile
          </Button>
          <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>

      {/* ✅ User Posts Grid */}
      <Typography variant="h6" sx={{ mt: 4 }}>My Posts</Typography>
      <Grid container spacing={2}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Grid item key={post.id} xs={6} sm={4}>
              <Card>
                <CardMedia component="img" image={post.img} alt={post.title} sx={{ height: 200 }} />
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
            No posts yet.
          </Typography>
        )}
      </Grid>

      {/* ✅ Edit Profile Modal */}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Box sx={{ p: 4, width: 400, mx: 'auto', mt: '20vh', backgroundColor: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>
          <TextField fullWidth margin="normal" label="Name" name="name" value={editData.name} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" value={editData.email} onChange={handleChange} />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
