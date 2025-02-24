import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box, Avatar } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Appbar({ toggleDarkMode, darkMode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data from the backend API
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/users/current');
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile'); // Adjust the path as needed
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Great Vibes", cursive',
            fontWeight: 'bold',
          }}
        >
          WildOgraphy
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Tooltip title="Toggle dark mode">
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </motion.div>
          {currentUser && (
            <motion.div whileHover={{ scale: 1.1 }}>
              <Tooltip title="Profile">
                <IconButton color="inherit" onClick={handleProfileClick}>
                  <Avatar src={currentUser.avatar} alt={currentUser.name} />
                </IconButton>
              </Tooltip>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
