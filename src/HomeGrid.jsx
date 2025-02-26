import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import { Typography, Modal, Container } from '@mui/material';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';

// Unified animation variants for Masonry items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  rest: {
    y: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    y: -8, // Subtle lift for floating effect
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

// Animation variants for headings
const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function HomeGrid({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/posts');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  // Trending Posts: Top 5 by likes
  const trendingPosts = posts
    .slice()
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5);

  // Posts from followed users
  const followingPosts =
    currentUser && currentUser.following && Array.isArray(currentUser.following)
      ? posts.filter((post) =>
          currentUser.following.some((followId) => String(followId) === String(post.userId))
        )
      : [];

  // All other posts (excluding trending and following)
  const trendingIds = trendingPosts.map((post) => post._id || post.id || '');
  const followingIds = followingPosts.map((post) => post._id || post.id || '');
  const allOtherPosts = posts.filter(
    (post) =>
      !trendingIds.includes(post._id || post.id || '') &&
      !followingIds.includes(post._id || post.id || '')
  );
  const visibleOtherPosts = allOtherPosts.slice(0, visibleCount);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setVisibleCount((prevCount) =>
          prevCount < allOtherPosts.length ? prevCount + 3 : prevCount
        );
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allOtherPosts.length]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
        {/* Trending Posts Section */}
        {posts.length > 0 && (
          <>
            <motion.div
              variants={headingVariants}
              initial="hidden"
              animate="visible"
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 4,
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '32px', md: '40px' },
                  color: 'text.primary',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  },
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  },
                }}
              >
                Trending Posts
              </Typography>
            </motion.div>
            <Masonry columns={{ xs: 2, sm: 3, md: 3 }} spacing={0.5}>
              {trendingPosts.map((post) => (
                <motion.div
                  key={post._id || post.id || Math.random().toString(36).substr(2, 9)}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  animate="rest"
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img
                      src={post.img || 'https://via.placeholder.com/300'}
                      alt={post.title || 'Untitled'}
                      loading="lazy"
                      style={{
                        width: '100%',
                        display: 'block',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </Masonry>
          </>
        )}

        {/* Following Posts Section */}
        {followingPosts.length > 0 && (
          <>
            <motion.div
              variants={headingVariants}
              initial="hidden"
              animate="visible"
            >
              <Typography
                variant="h3"
                sx={{
                  mt: 6,
                  mb: 4,
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '32px', md: '40px' },
                  color: 'text.primary',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  },
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  },
                }}
              >
                Posts from People You Follow
              </Typography>
            </motion.div>
            <Masonry columns={{ xs: 2, sm: 3, md: 3 }} spacing={0.5}>
              {followingPosts.map((post) => (
                <motion.div
                  key={post._id || post.id || Math.random().toString(36).substr(2, 9)}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  animate="rest"
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img
                      src={post.img || 'https://via.placeholder.com/300'}
                      alt={post.title || 'Untitled'}
                      loading="lazy"
                      style={{
                        width: '100%',
                        display: 'block',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </Masonry>
          </>
        )}

        {/* All Posts Section */}
        {allOtherPosts.length > 0 && (
          <>
            <motion.div
              variants={headingVariants}
              initial="hidden"
              animate="visible"
            >
              <Typography
                variant="h3"
                sx={{
                  mt: 6,
                  mb: 4,
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '32px', md: '40px' },
                  color: 'text.primary',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  },
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  },
                }}
              >
                All Posts
              </Typography>
            </motion.div>
            <Masonry columns={{ xs: 2, sm: 3, md: 3 }} spacing={0.5}>
              {visibleOtherPosts.map((post) => (
                <motion.div
                  key={post._id || post.id || Math.random().toString(36).substr(2, 9)}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  animate="rest"
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img
                      src={post.img || 'https://via.placeholder.com/300'}
                      alt={post.title || 'Untitled'}
                      loading="lazy"
                      style={{
                        width: '100%',
                        display: 'block',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </Masonry>
          </>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <Modal
            open={Boolean(selectedPost)}
            onClose={() => setSelectedPost(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(5px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Box
                sx={{
                  width: { xs: '90%', sm: 850 },
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  p: 3,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <PostDetailModal
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                  currentUser={currentUser}
                />
              </Box>
            </motion.div>
          </Modal>
        )}
      </Container>
    </Box>
  );
}