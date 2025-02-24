// src/ViewProfile.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Box, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import PostDetailModal from './PostDetailModal';

const ViewProfile = ({ currentUser }) => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch the user's public profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/users/${userId}`);
        if (!response.ok) throw new Error(response.status);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    // Fetch all posts and filter by the user's ID
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/posts`);
        if (!response.ok) throw new Error(response.status);
        const data = await response.json();
        const userPosts = data.filter(post => String(post.userId) === String(userId));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [userId]);

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar src={profile.avatar} sx={{ width: 120, height: 120, mr: 3 }} />
        <Box>
          <Typography variant="h4">
            {profile.username || profile.name || 'User'}
          </Typography>
          {profile.bio && (
            <Typography variant="body1" color="text.secondary">
              {profile.bio}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Posts</Typography>
      {posts.length > 0 ? (
        <Grid container spacing={2}>
          {posts.map(post => (
            <Grid item key={post._id || post.id} xs={12} sm={6} md={4}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => setSelectedPost(post)}>
                <CardMedia 
                  component="img" 
                  image={post.img} 
                  alt={post.title} 
                  sx={{ height: 200, objectFit: 'cover' }} 
                />
                <CardContent>
                  <Typography variant="subtitle1">{post.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">No posts available.</Typography>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
          onPostUpdated={(updatedPost) => {
            setPosts(prevPosts => prevPosts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
          }} 
          currentUser={currentUser}
        />
      )}
    </Container>
  );
};

export default ViewProfile;
