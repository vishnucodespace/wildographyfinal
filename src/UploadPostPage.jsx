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
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.15 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const buttonVariants = {
  hover: { 
    scale: 1.02, 
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

const UploadPostPage = ({ user }) => {
  const [imgUrl, setImgUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Wild');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

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
    const loggedUser = user || JSON.parse(localStorage.getItem('user'));
    const userId = loggedUser?._id || loggedUser?.id;
    console.log('Logged in user:', loggedUser);
    if (!userId) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please log in.',
        icon: 'warning',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top', // Pop in from the top
        width: '250px', // Smaller width
        padding: '0.75rem', // Compact padding
        customClass: {
          popup: 'swal2-rectangular-popup', // Custom class for rectangular shape
        },
      });
      return;
    }
    if (!imgUrl) {
      setError('Please provide an image URL.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/posts`, {
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
      console.log('Response from server:', data);
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Post Uploaded!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top', // Pop in from the top
          width: '250px', // Smaller width
          padding: '0.75rem', // Compact padding
          customClass: {
            popup: 'swal2-rectangular-popup', // Custom class for rectangular shape
          },
        });
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
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 520 }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              color: 'text.primary',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 3,
                background: (theme) => theme.palette.primary.main,
                borderRadius: 2,
              },
            }}
          >
            Upload a Post
          </Typography>
          <form onSubmit={handleSubmit}>
            <motion.div variants={fieldVariants}>
              <TextField
                label="Image URL"
                variant="outlined"
                fullWidth
                margin="normal"
                value={imgUrl}
                onChange={handleImgUrlChange}
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { 
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': { 
                    color: 'text.secondary',
                    '&.Mui-focused': { color: 'primary.main' },
                  },
                }}
              />
            </motion.div>
            {preview && !imageError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Box 
                  sx={{ 
                    mt: 2, 
                    mb: 3,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={() => setImageError(true)}
                  />
                </Box>
              </motion.div>
            )}
            {imageError && (
              <Typography
                sx={{
                  mt: 2,
                  mb: 2,
                  textAlign: 'center',
                  color: 'error.main',
                  fontSize: '0.95rem',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                  py: 1,
                  borderRadius: 2,
                }}
              >
                Image failed to load
              </Typography>
            )}
            <motion.div variants={fieldVariants}>
              <TextField
                label="Caption"
                variant="outlined"
                fullWidth
                margin="normal"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { 
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': { 
                    color: 'text.secondary',
                    '&.Mui-focused': { color: 'primary.main' },
                  },
                }}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { 
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': { 
                    color: 'text.secondary',
                    '&.Mui-focused': { color: 'primary.main' },
                  },
                }}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ 
                  color: 'text.secondary',
                  '&.Mui-focused': { color: 'primary.main' },
                }}>
                  Tag
                </InputLabel>
                <Select
                  value={tag}
                  label="Tag"
                  onChange={handleTagChange}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'divider' 
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'primary.main' 
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="Marine">Marine</MenuItem>
                  <MenuItem value="Wild">Wild</MenuItem>
                </Select>
              </FormControl>
            </motion.div>
            {error && (
              <Typography
                sx={{
                  mt: 2,
                  mb: 3,
                  textAlign: 'center',
                  color: 'error.main',
                  fontSize: '0.95rem',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                  py: 1,
                  borderRadius: 2,
                }}
              >
                {error}
              </Typography>
            )}
            <motion.div variants={fieldVariants}>
              <Button
                component={motion.button}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  },
                  '&:disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </motion.div>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default UploadPostPage;