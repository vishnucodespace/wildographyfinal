// src/components/UploadPostPage.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Input } from '@mui/material';
import { motion } from 'framer-motion';

const UploadPostPage = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to upload a post.');
      return;
    }
    const newPost = {
      id: Date.now(),
      userId: user.id,
      img: file,
      title: caption || 'Untitled Post',
    };

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('Post Uploaded!');
    setFile(null);
    setCaption('');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ p: 4, width: 400 }}>
          <Typography variant="h4" gutterBottom>
            Upload Post
          </Typography>
          <form onSubmit={handleSubmit}>
            <Button variant="contained" component="label" fullWidth>
              Select Image/Video
              <Input type="file" sx={{ display: 'none' }} onChange={handleFileChange} />
            </Button>
            {file && (
              <Box sx={{ mt: 2 }}>
                <img src={file} alt="Preview" style={{ width: '100%', borderRadius: 4 }} />
              </Box>
            )}
            <TextField
              label="Caption"
              variant="outlined"
              fullWidth
              margin="normal"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} component={motion.button} whileHover={{ scale: 1.05 }}>
              Upload
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default UploadPostPage;
