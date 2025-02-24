import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';

const UploadPostPage = ({ user }) => {
  const [imgUrl, setImgUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Wild'); // default tag
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  // When URL is changed, update preview and reset image error flag
  const handleImgUrlChange = (e) => {
    const url = e.target.value;
    setImgUrl(url);
    setPreview(url);
    setImageError(false);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use the passed user prop or fall back to localStorage if not provided
    const loggedUser = user || JSON.parse(localStorage.getItem('user'));
    const userId = loggedUser?._id || loggedUser?.id;
    console.log("Logged in user:", loggedUser);
    if (!userId) {
      alert('Please log in to upload a post.');
      return;
    }
    if (!imgUrl) {
      setError('Please provide an image URL.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5174/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          title: caption || 'Untitled Post',
          img: imgUrl,
          description,
          tag,
        }),
      });
      const data = await response.json();
      console.log("Response from server:", data);
      if (response.ok) {
        alert('Post Uploaded!');
        setImgUrl('');
        setPreview('');
        setCaption('');
        setDescription('');
        setTag('Wild');
      } else {
        setError(data.error || 'Failed to upload post');
      }
    } catch (err) {
      console.error('Error uploading post:', err);
      setError('An error occurred while uploading the post.');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f5f5f5',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4, width: { xs: '90%', sm: 500 }, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Upload Post
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Image URL"
              variant="outlined"
              fullWidth
              margin="normal"
              value={imgUrl}
              onChange={handleImgUrlChange}
              required
            />
            {preview && !imageError && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                  onError={() => setImageError(true)}
                />
              </Box>
            )}
            {imageError && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography color="error" variant="body2">
                  Sorry, we can't fetch your work <span role="img" aria-label="cute face">😊</span>
                </Typography>
              </Box>
            )}
            <TextField
              label="Caption (Title)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tag-select-label">Tag</InputLabel>
              <Select
                labelId="tag-select-label"
                id="tag-select"
                value={tag}
                label="Tag"
                onChange={handleTagChange}
              >
                <MenuItem value="Marine">Marine</MenuItem>
                <MenuItem value="Wild">Wild</MenuItem>
              </Select>
            </FormControl>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default UploadPostPage;
