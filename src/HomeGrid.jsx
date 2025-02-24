// src/components/HomeGrid.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
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

export default function HomeGrid({ searchItem, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

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

  // Filter posts based on search input (case-insensitive)
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 1200, width: '100%', p: 2 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {filteredPosts.map((post) => (
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
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          currentUser={currentUser}
        />
      )}
    </Box>
  );
}
