// src/ViewProfile.jsx
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
  Divider
} from '@mui/material';
import PostDetailModal from './PostDetailModal';

const ViewProfile = () => {
  // Retrieve currentUser from location state (passed from navigation)
  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const { userId } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  // Track follow status: requested if follow-request sent, or following if already following
  const [isRequested, setIsRequested] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch the profile details and posts for this user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/users/${userId}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/posts`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
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

  // Set follow state based on currentUser.following (if available)
  useEffect(() => {
    if (profile && currentUser) {
      if (currentUser.following && currentUser.following.includes(profile._id)) {
        setIsFollowing(true);
      }
    }
  }, [profile, currentUser]);

  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem("token");

  // Handle sending a follow request
  const handleFollowRequest = async () => {
    if (!currentUser) {
      console.error("currentUser is undefined");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5174/api/users/${userId}/follow-request`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ followerId: currentUser._id })
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

  // Handle unfollow action
  const handleUnfollow = async () => {
    if (!currentUser) {
      console.error("currentUser is undefined");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5174/api/users/${userId}/unfollow`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ followerId: currentUser._id })
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
          <Typography variant="h4">{profile.username || profile.name || 'User'}</Typography>
          {profile.bio && (
            <Typography variant="body1" color="text.secondary">{profile.bio}</Typography>
          )}
          {/* Follow/Unfollow Button Section (only show if not viewing own profile) */}
          {currentUser && currentUser._id !== profile._id && (
            <Box sx={{ mt: 2 }}>
              {isFollowing ? (
                <Button variant="contained" color="error" onClick={handleUnfollow}>
                  Unfollow
                </Button>
              ) : isRequested ? (
                <Button variant="outlined" disabled>
                  Requested
                </Button>
              ) : (
                <Button variant="contained" onClick={handleFollowRequest}>
                  Follow
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: 4 }} />
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
