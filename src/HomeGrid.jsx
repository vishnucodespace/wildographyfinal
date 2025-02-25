// src/HomeGrid.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import { Typography, Modal } from '@mui/material';
import PostDetailModal from './PostDetailModal';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

export default function HomeGrid({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  // visibleCount for infinite scroll in the "All Posts" section
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch all posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // Compute trending posts: top 5 posts sorted by likes (highest first)
  const trendingPosts = posts
    .slice() // create a copy
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5);

  // Compute normal posts: those not included in trendingPosts
  const trendingIds = trendingPosts.map((post) => post._id || post.id);
  const normalPosts = posts.filter(
    (post) => !trendingIds.includes(post._id || post.id)
  );

  // Get the visible normal posts based on the current visible count
  const visibleNormalPosts = normalPosts.slice(0, visibleCount);

  // Infinite scroll: increase visibleCount when scrolling near the bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setVisibleCount((prevCount) =>
          prevCount < normalPosts.length ? prevCount + 3 : prevCount
        );
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [normalPosts.length]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 1200, width: '100%', p: 2 }}>
        {/* Trending Posts Section */}
        <Typography variant="h4" sx={{ mb: 2 }}>
          Trending Posts
        </Typography>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {trendingPosts.map((post) => (
            <Box
              key={post._id || post.id}
              sx={{ borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.img}
                alt={post.title}
                loading="lazy"
                style={{
                  width: '100%',
                  display: 'block',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <Label>{post.title}</Label>
            </Box>
          ))}
        </Masonry>

        {/* All Posts Section with Infinite Scrolling */}
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          All Posts
        </Typography>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {visibleNormalPosts.map((post) => (
            <Box
              key={post._id || post.id}
              sx={{ borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.img}
                alt={post.title}
                loading="lazy"
                style={{
                  width: '100%',
                  display: 'block',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <Label>{post.title}</Label>
            </Box>
          ))}
        </Masonry>
      </Box>
      
      {/* Full-screen Modal for Post Details */}
      {selectedPost && (
        <Modal
          open={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '90%',
              maxWidth: 800,
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 2,
            }}
          >
            <PostDetailModal 
              post={selectedPost} 
              onClose={() => setSelectedPost(null)}
              currentUser={currentUser}
            />
          </Box>
        </Modal>
      )}
    </Box>
  );
}
