import React, { useState, useEffect } from 'react';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';

// Animation variants
const listItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const Notifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications for the current user
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/notifications?userId=${currentUser._id}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

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
        Notifications
      </Typography>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {notifications.length > 0 ? (
          <List 
            sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 3, 
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
              >
                <ListItem 
                  sx={{ 
                    py: 2,
                    px: 3,
                    '&:hover': { bgcolor: 'background.default' },
                    transition: 'background-color 0.2s',
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <ListItemText 
                    primary={notification.message}
                    secondary={new Date(notification.date).toLocaleString()}
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                    secondaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.secondary',
                    }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        ) : (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              textAlign: 'center',
              bgcolor: 'background.paper',
              py: 3,
              borderRadius: 2,
              fontStyle: 'italic',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            No notifications.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Notifications;