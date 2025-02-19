// src/components/ExplorePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(storedPosts);
  }, []);

  // Example video card (could be one of many)
  const videoCard = {
    id: 'video-1',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Wildlife in Action'
  };

  // Combine posts with a video card inserted at a desired index (e.g., after 2 items)
  const combinedPosts = [...posts];
  combinedPosts.splice(2, 0, videoCard);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Explore Posts from the Wild
      </Typography>
      <Grid container spacing={2}>
        {combinedPosts.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              {item.video ? (
                <Card sx={{ borderRadius: 2 }}>
                  <CardMedia
                    component="video"
                    controls
                    image={item.video}
                    title={item.title}
                    sx={{ height: 300, objectFit: 'cover' }}
                  />
                  <Typography variant="body1" align="center" sx={{ p: 1 }}>
                    {item.title}
                  </Typography>
                </Card>
              ) : (
                <Card sx={{ borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    image={item.img}
                    alt={item.title}
                    sx={{ height: 300, objectFit: 'cover' }}
                  />
                  <Typography variant="body1" align="center" sx={{ p: 1 }}>
                    {item.title}
                  </Typography>
                </Card>
              )}
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExplorePage;
