import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import { Typography, Modal, Container } from '@mui/material';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';
const API_URL = import.meta.env.VITE_API_URL;


// Animation variants for Masonry items (unchanged)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  rest: { y: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  hover: { y: -8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
};

// Animation variants for fading headings
const headingFadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeInOut' },
  },
  hover: { opacity: 0.9, scale: 1.02 },
};

// Animation for the glowing underline
const underlineFadeVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.5, ease: 'easeInOut', delay: 0.3 },
  },
  hover: { opacity: 0.8 },
};

// Custom AnimatedHeading component with fading effects
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
          fontFamily: '"Roboto", sans-serif', // Safe default font
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

export default function HomeGrid({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts`);
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
            <AnimatedHeading text="Trending Posts" />
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
            <AnimatedHeading text="Following" />
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
            <AnimatedHeading text="All Posts" />
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

{selectedPost && (
        <Modal
          open={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)', // Reduced blur for subtlety
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            '&:focus': { outline: 'none', border: 'none' },
            zIndex: 1200, // Set a specific zIndex to avoid overlap
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
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)', // Optional: keep or adjust
                p: 3,
                border: 'none',
                outline: 'none',
                '&:focus': { outline: 'none', border: 'none' },
                zIndex: 1201, // Ensure above the backdrop
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