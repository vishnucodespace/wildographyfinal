import React from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';

const SettingsPage = ({ darkMode, toggleDarkMode }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', p: 2 }}>
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ p: 4, width: 400 }}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
            label="Dark Mode"
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Customize your experience.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default SettingsPage;
