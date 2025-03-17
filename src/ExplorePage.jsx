import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Tabs, Tab, InputAdornment } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';
import { keyframes } from '@mui/system';
import '@fontsource/playfair-display/700.css'; // Elegant typography
import '@fontsource/poppins'; // Add Poppins font for subtitle
import SearchIcon from '@mui/icons-material/Search'; // Search icon
import GridViewIcon from '@mui/icons-material/GridView'; // Icon for "All"
import WavesIcon from '@mui/icons-material/Waves'; // Icon for "Marine"
import PetsIcon from '@mui/icons-material/Pets'; // Icon for "Wild"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

// Keyframes for fade-in animation (kept for reference)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Animation variants for hero section
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

// Animation variants for grid items
const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

// Main ExplorePage Component
const ExplorePage = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === 'All' || post.tag === selectedTag;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleTabChange = (event, newValue) => setSelectedTag(newValue);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handlePostClick = (post) => setSelectedPost(post);
  const handleCloseModal = () => setSelectedPost(null);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Updated Hero Section with Video Background */}
      <motion.div initial="hidden" animate="visible" variants={heroVariants}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: '50vh', md: '60vh' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 6,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Video Background with Fallback */}
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
            onError={(e) => console.error('Video failed to load:', e)} // Log errors if video fails
          >
            <source
              src="https://videos.pexels.com/video-files/6318569/6318569-sd_960_506_25fps.mp4" // Reliable Pexels video
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.6)', // Dark overlay
              zIndex: 1,
            }}
          />
          <Box sx={{ zIndex: 2, textAlign: 'center', px: 2 }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
              }}
            >
              Explore Nature’s Wonders
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E0E0E0',
                mt: 2,
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Discover inspiring stories and breathtaking visuals.
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
        {/* Updated Search Bar Design */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6, px: { xs: 2, sm: 0 } }}>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            style={{ width: '100%', maxWidth: '700px' }} // Wider search bar
          >
            <TextField
              placeholder="Search posts..." // Changed to placeholder for cleaner look
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#555', fontSize: '1.5rem', mr: 1 }} /> {/* Larger icon with spacing */}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px', // More rounded
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px 16px', // Larger padding for a bigger input
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)' },
                  '&.Mui-focused': { boxShadow: '0 6px 20px rgba(39, 174, 96, 0.3)' },
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#27ae60' },
                  '&.Mui-focused fieldset': { borderColor: '#27ae60', borderWidth: '2px' },
                },
                '& .MuiInputBase-input': {
                  fontFamily: '"Roboto", sans-serif',
                  color: '#333',
                  fontSize: '1.2rem', // Larger text
                  padding: '12px 16px 12px 40px', // Adjusted padding to fit icon
                  '&::placeholder': { color: '#888', opacity: 1, fontStyle: 'italic' },
                },
              }}
            />
          </motion.div>
        </Box>

        {/* Tabs with Icons */}
        <Tabs
          value={selectedTag}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 6,
            '& .MuiTab-root': {
              fontFamily: '"Roboto", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2c3e50',
              borderRadius: '10px',
              px: 4,
              py: 1.5,
              transition: 'all 0.3s ease-in-out',
              '&:hover': { color: '#27ae60', bgcolor: 'rgba(39, 174, 96, 0.1)', transform: 'scale(1.05)' },
              '&.Mui-selected': { color: '#27ae60', bgcolor: 'rgba(39, 174, 96, 0.15)', border: '1px solid #27ae60', fontWeight: 700 },
            },
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab label="All" value="All" icon={<GridViewIcon />} iconPosition="start" />
          <Tab label="Marine" value="Marine" icon={<WavesIcon />} iconPosition="start" />
          <Tab label="Wild" value="Wild" icon={<PetsIcon />} iconPosition="start" />
        </Tabs>

        {/* Posts Grid */}
        <Box sx={{ mt: 4, position: 'relative' }}>
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3} sx={{ width: '100%' }}>
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id || post.id}
                variants={gridItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(39, 174, 96, 0.2)' }}
              >
                <Box
                  sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: '#fff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 8px 20px rgba(39, 174, 96, 0.2)', borderColor: '#27ae60' },
                    display: 'flex',
                    flexDirection: 'column',
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
                      style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                    />
                  ) : (
                    <img
                      src={post.img}
                      alt={post.title}
                      loading="lazy"
                      style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                    />
                  )}
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 600, color: '#2c3e50', textAlign: 'left', lineHeight: 1.2, mb: 1 }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: '"Roboto", sans-serif', color: '#7f8c8d', textAlign: 'left', fontSize: '0.85rem' }}
                    >
                      {post.tag}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#f9f9f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography sx={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                      Likes: {post.likes || 0}
                    </Typography>
                    <Typography sx={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                      Comments: {post.comments?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Masonry>
        </Box>

        {/* Modal */}
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
    </Box>
  );
};

export default ExplorePage;