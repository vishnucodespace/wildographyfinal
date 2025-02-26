import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Tabs, Tab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';

const ExplorePage = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === "All" || post.tag === selectedTag;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTag(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePostClick = (post) => setSelectedPost(post);
  const handleCloseModal = () => setSelectedPost(null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Title with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: '#2c3e50',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Explore Posts
        </Typography>
      </motion.div>

      {/* Search bar with enhanced styling */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Search posts..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: '60%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
            '& .MuiInputLabel-root': {
              color: '#2c3e50',
            },
          }}
        />
      </Box>

      {/* Tabs with hover effects and consistent styling */}
      <Tabs
        value={selectedTag}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{
          '& .MuiTab-root': {
            fontFamily: '"Roboto", sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            color: '#2c3e50',
            '&:hover': {
              color: '#27ae60',
              transition: 'color 0.3s ease',
            },
          },
          '& .Mui-selected': {
            color: '#27ae60',
          },
        }}
      >
        <Tab label="All" value="All" />
        <Tab label="Marine" value="Marine" />
        <Tab label="Wild" value="Wild" />
      </Tabs>

      {/* Masonry grid with enhanced card styling */}
      <Box sx={{ mt: 4 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {filteredPosts.map((post) => (
            <Box
              key={post._id || post.id}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                },
              }}
              onClick={() => handlePostClick(post)}
            >
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                {post.video ? (
                  <img
                    src={post.video}
                    alt={post.title}
                    style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  />
                ) : (
                  <img
                    src={post.img}
                    alt={post.title}
                    style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  />
                )}
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    mt: 1,
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: 500,
                    color: '#2c3e50',
                  }}
                >
                  {post.title}
                </Typography>
              </motion.div>
            </Box>
          ))}
        </Masonry>
      </Box>

      {/* Modal with fade-in animation */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <PostDetailModal post={selectedPost} onClose={handleCloseModal} currentUser={currentUser} />
        </motion.div>
      )}
    </Container>
  );
};

export default ExplorePage;