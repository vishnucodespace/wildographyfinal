import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const SettingsPage = ({ toggleDarkMode, darkMode, currentUser }) => {
  // State for settings (persisted locally for demo; ideally, sync with backend)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);

  // Load initial settings from localStorage or backend (simulated here)
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    if (storedSettings) {
      const { notifications, email, privacy } = JSON.parse(storedSettings);
      setNotificationsEnabled(notifications ?? true);
      setEmailNotifications(email ?? false);
      setPrivateAccount(privacy ?? false);
    }
  }, []);

  // Save settings to localStorage (could be an API call in a real app)
  const saveSettings = () => {
    const settings = {
      notifications: notificationsEnabled,
      email: emailNotifications,
      privacy: privateAccount,
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // Simulate API call
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setNotificationsEnabled(true);
    setEmailNotifications(false);
    setPrivateAccount(false);
    localStorage.removeItem('userSettings');
    alert('Settings reset to defaults.');
  };

  return (
    <Container 
      sx={{ 
        mt: 6, 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: 4,
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 4,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 50,
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: 2,
          },
        }}
      >
        Settings
      </Typography>

      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {/* Appearance Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 3, 
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Appearance
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    color="primary"
                  />
                }
                label="Dark Mode"
                sx={{ color: 'text.secondary' }}
              />
            </FormGroup>
          </Paper>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 3, 
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Notifications
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Notifications"
                sx={{ color: 'text.secondary' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    color="primary"
                    disabled={!notificationsEnabled}
                  />
                }
                label="Email Notifications"
                sx={{ color: 'text.secondary', ml: 2 }}
              />
            </FormGroup>
          </Paper>
        </motion.div>

        {/* Privacy Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 3, 
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Privacy
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={privateAccount}
                    onChange={(e) => setPrivateAccount(e.target.checked)}
                    color="primary"
                  />
                }
                label="Private Account"
                sx={{ color: 'text.secondary' }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  mt: 1, 
                  ml: 4,
                  fontStyle: 'italic',
                }}
              >
                When enabled, only approved followers can see your posts.
              </Typography>
            </FormGroup>
          </Paper>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
              onClick={saveSettings}
            >
              Save Settings
            </Button>
            <Button
              variant="outlined"
              color="error"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                  borderColor: 'error.dark',
                },
              }}
              onClick={resetSettings}
            >
              Reset to Defaults
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};

export default SettingsPage;