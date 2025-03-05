import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Tabs, Tab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';
import { keyframes } from '@mui/system';

// Reusing AnimatedHeading from HomeGrid
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const headingFadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeInOut' },
  },
  hover: { opacity: 0.9, scale: 1.02 },
};

const underlineFadeVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.5, ease: 'easeInOut', delay: 0.3 },
  },
  hover: { opacity: 0.8 },
};

const AnimatedHeading = ({ text }) => (
  <Box sx={{ textAlign: 'center', mb: 5, mt: 4 }}>
    <motion.div
      variants={headingFadeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 700,
          fontSize: { xs: '28px', md: '40px' },
          color: 'text.primary',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          position: 'relative',
          textShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 0 10px rgba(255,255,255,0.4)'
              : '0 0 10px rgba(0,0,0,0.2)',
        }}
      >
        {text}
        <motion.div
          variants={underlineFadeVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          sx={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '3px',
            bgcolor: 'primary.main',
            borderRadius: '2px',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 0 12px rgba(66,165,245,0.6)'
                : '0 0 12px rgba(25,118,210,0.4)',
          }}
        />
      </Typography>
    </motion.div>
  </Box>
);

// Animation variants for other elements
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  hover: { scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
};

const tabVariants = {
  hover: { scale: 1.05, color: '#27ae60', transition: { duration: 0.2 } },
};

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
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        bgcolor: 'background.default',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Heading from HomeGrid */}
      <AnimatedHeading text="Explore Posts" />

      {/* Refreshed Search Field with Pexels-inspired, Cleaner Style */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 4,
          position: 'relative',
        }}
      >
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          whileTap={{ scale: 0.98 }}
        >
          <TextField
            label="Search posts..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: { xs: '80%', sm: '60%', md: '50%' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px', // Larger, softer rounded corners for a sleek look
                boxShadow: 'none', // Removed shadow for a flatter, cleaner design
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease-in-out',
                border: '1px solid #e0e0e0', // Subtle border for definition
                '&:hover': {
                  borderColor: '#27ae60', // Green border on hover
                  boxShadow: '0 2px 10px rgba(39, 174, 96, 0.1)', // Light shadow on hover
                  transform: 'translateY(-2px)',
                },
                '&.Mui-focused': {
                  borderColor: '#27ae60', // Green border on focus
                  boxShadow: '0 4px 16px rgba(39, 174, 96, 0.2)', // Subtle green glow on focus
                },
              },
              '& .MuiInputLabel-root': {
                color: '#2c3e50',
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
                transform: 'translate(14px, 12px) scale(1)', // Adjust label position for larger radius
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif',
                color: '#2c3e50',
                padding: '14px 16px', // More padding for spaciousness
              },
            }}
          />
        </motion.div>
      </Box>

      {/* Refreshed Navigation (Tabs) with Pexels-inspired, Cleaner Style */}
      <Tabs
        value={selectedTag}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            fontFamily: '"Roboto", sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            color: '#2c3e50',
            bgcolor: 'transparent', // Removed background for a cleaner look
            borderRadius: '10px', // Softer rounded corners
            px: 4,
            py: 1.5,
            boxShadow: 'none', // Removed shadow for flat design
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              color: '#27ae60',
              bgcolor: 'rgba(39, 174, 96, 0.1)', // Light green background on hover
              transform: 'scale(1.05)',
            },
            '&.Mui-selected': {
              color: '#27ae60',
              bgcolor: 'rgba(39, 174, 96, 0.15)', // Slightly darker green background for selected
              border: '1px solid #27ae60', // Thin green border for selected
              fontWeight: 700,
            },
          },
          '& .MuiTabs-indicator': {
            display: 'none', // Hide default indicator, use custom styling
          },
        }}
      >
        <Tab label="All" value="All" />
        <Tab label="Marine" value="Marine" />
        <Tab label="Wild" value="Wild" />
      </Tabs>

      {/* Maintain Post Style (Masonry Grid) from Previous Version */}
      <Box sx={{ mt: 4, position: 'relative' }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing={4}
          sx={{ width: '100%' }}
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post._id || post.id}
              variants={gridItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hover"
              style={{ overflow: 'hidden' }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)', // Softer shadow
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
                    transform: 'translateY(-6px)',
                  },
                  position: 'relative',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)', // Subtle gradient for depth
                }}
                onClick={() => handlePostClick(post)}
              >
                {post.video ? (
                  <video
                    src={post.video}
                    alt={post.title}
                    autoPlay
                    loop
                    muted
                    style={{
                      width: '100%',
                      height: 400, // Slightly taller for emphasis
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0',
                    }}
                  />
                ) : (
                  <img
                    src={post.img}
                    alt={post.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 400, // Slightly taller for emphasis
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0',
                    }}
                  />
                )}
                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      mt: 1,
                      fontFamily: '"Roboto", sans-serif',
                      fontWeight: 600,
                      color: '#2c3e50',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#27ae60',
                      },
                    }}
                  >
                    {post.title}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Masonry>
      </Box>

      {/* Modal with fade-in and slide animation, consistent with HomeGrid */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <PostDetailModal post={selectedPost} onClose={handleCloseModal} currentUser={currentUser} />
        </motion.div>
      )}
    </Container>
  );
};

export default ExplorePage;