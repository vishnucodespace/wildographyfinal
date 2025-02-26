import React, { useState, useEffect } from 'react';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Typography,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';

// Animation variants
const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const FollowRequests = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch notifications for the current user and filter for follow requests
    const fetchFollowRequests = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`http://localhost:5174/api/notifications?userId=${currentUser._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        // Filter for notifications of type 'follow_request'
        const followRequests = data.filter(notif => notif.type === 'follow_request');
        setRequests(followRequests);
      } catch (error) {
        console.error('Error fetching follow requests:', error);
      }
    };

    fetchFollowRequests();
  }, [currentUser, token]);

  // Handler for accepting a follow request
  const handleAccept = async (requesterId) => {
    try {
      const response = await fetch(`http://localhost:5174/api/users/${requesterId}/accept-follow-request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.fromUser !== requesterId));
      } else {
        console.error('Error accepting follow request:', data.error);
      }
    } catch (error) {
      console.error('Error accepting follow request:', error);
    }
  };

  // Handler for rejecting a follow request
  const handleReject = async (requesterId) => {
    try {
      const response = await fetch(`http://localhost:5174/api/users/${requesterId}/reject-follow-request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.fromUser !== requesterId));
      } else {
        console.error('Error rejecting follow request:', data.error);
      }
    } catch (error) {
      console.error('Error rejecting follow request:', error);
    }
  };

  // Handler for following back the requester
  const handleFollowBack = async (requesterId) => {
    try {
      const response = await fetch(`http://localhost:5174/api/users/${requesterId}/follow-back`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.fromUser !== requesterId));
      } else {
        console.error('Error following back:', data.error);
      }
    } catch (error) {
      console.error('Error following back:', error);
    }
  };

  return (
    <Container 
      sx={{ 
        mt: 6, 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: 4 
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          position: 'relative',
          mb: 4,
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
        Follow Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            textAlign: 'center',
            bgcolor: 'background.paper',
            py: 2,
            borderRadius: 2,
            fontStyle: 'italic',
          }}
        >
          No follow requests.
        </Typography>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          {requests.map((request) => (
            <motion.div
              key={request._id}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
            >
              <ListItem 
                divider
                sx={{ 
                  py: 2,
                  '&:hover': { bgcolor: 'background.default' },
                  transition: 'background-color 0.2s',
                }}
              >
                <ListItemText 
                  primary={request.message} 
                  secondary={`From User ID: ${request.fromUser}`}
                  primaryTypographyProps={{ variant: 'body1', fontWeight: 500, color: 'text.primary' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    component={motion.button}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      textTransform: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => handleAccept(request.fromUser)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    component={motion.button}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    sx={{ 
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                        borderColor: 'error.dark',
                      },
                    }}
                    onClick={() => handleReject(request.fromUser)}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={motion.button}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    sx={{ 
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      textTransform: 'none',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(66,165,245,0.1)' : '#f0f7ff',
                        borderColor: 'primary.dark',
                      },
                    }}
                    onClick={() => handleFollowBack(request.fromUser)}
                  >
                    Follow Back
                  </Button>
                </Box>
              </ListItem>
            </motion.div>
          ))}
        </List>
      )}
    </Container>
  );
};

export default FollowRequests;