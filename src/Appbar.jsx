import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion } from 'framer-motion';
import Avatars from './Avatars';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export default function Appbar({ toggleDarkMode, darkMode }) {
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
          variant="h4" // Larger than h6, adjustable
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
          <motion.div whileHover={{ scale: 1.1 }}>
            <Tooltip title="Profile">
              <IconButton color="inherit">
                <Avatars />
              </IconButton>
            </Tooltip>
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}