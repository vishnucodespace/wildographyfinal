// ExplorePage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Tabs, Tab } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import PostDetailModal from './PostDetailModal';

const ExplorePage = ({currentUser}) => {
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
      <Typography variant="h4" align="center" gutterBottom>
        Explore Posts
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Search posts..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '60%' }}
        />
      </Box>
      <Tabs
        value={selectedTag}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="All" value="All" />
        <Tab label="Marine" value="Marine" />
        <Tab label="Wild" value="Wild" />
      </Tabs>
      <Box sx={{ mt: 4 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {filteredPosts.map((post) => (
            <Box
              key={post._id || post.id}
              sx={{ borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => handlePostClick(post)}
            >
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                {post.video ? (
                  <img src={post.video} alt={post.title} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <img src={post.img} alt={post.title} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                  {post.title}
                </Typography>
              </motion.div>
            </Box>
          ))}
        </Masonry>
      </Box>
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={handleCloseModal} currentUser = {currentUser}/>
      )}
    </Container>
  );
};

export default ExplorePage;
