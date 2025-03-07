import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
  Avatar,
} from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

export default function Appbar({ toggleDarkMode, darkMode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_URL}/api/users/current`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileClick = () => navigate('/profile');

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #1B4D3E 30%, #2A6B54 90%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: 'none',
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          py: { xs: 1, md: 1.5 },
          px: { xs: 2, md: 4 },
          minHeight: { xs: 64, md: 72 },
        }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400 }}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate("/")}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="WildOgraphy Logo"
            sx={{
              width: '100%',
              maxWidth: { xs: 180, md: 250 },
              height: 'auto',
              maxHeight: { xs: 56, md: 64 },
              objectFit: 'contain',
            }}
          />
        </motion.div>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 } }}>
          <motion.div whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Tooltip 
              title="Toggle dark mode" 
              enterDelay={500}
              componentsProps={{ tooltip: { sx: { bgcolor: '#1B4D3E', borderRadius: 2, fontSize: '0.9rem', padding: '6px 12px' } } }}
            >
              <IconButton 
                onClick={toggleDarkMode}
                sx={{
                  color: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  p: 1,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
                  transition: 'all 0.2s ease',
                }}
              >
                {darkMode ? <Brightness7Icon sx={{ fontSize: { xs: 24, md: 28 } }} /> : <Brightness4Icon sx={{ fontSize: { xs: 24, md: 28 } }} />}
              </IconButton>
            </Tooltip>
          </motion.div>

          <AnimatePresence>
            {currentUser && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Tooltip 
                  title="Profile"
                  enterDelay={500}
                  componentsProps={{ tooltip: { sx: { bgcolor: '#1B4D3E', borderRadius: 2, fontSize: '0.9rem', padding: '6px 12px' } } }}
                >
                  <IconButton 
                    color="inherit" 
                    onClick={handleProfileClick}
                    sx={{ p: 0, transition: 'all 0.3s ease' }}
                  >
                    <Avatar 
                      src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`} 
                      alt={currentUser.name}
                      sx={{
                        width: { xs: 38, md: 44 },
                        height: { xs: 38, md: 44 },
                        border: '2px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { borderColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' },
                        transition: 'all 0.2s ease',
                      }}
                      component={motion.div}
                      whileHover={{ scale: 1.1, rotate: 5, boxShadow: '0 6px 16px rgba(0,0,0,0.3)' }}
                      whileTap={{ scale: 0.95 }}
                    />
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
