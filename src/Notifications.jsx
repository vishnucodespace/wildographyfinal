import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';

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
    <Container>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <ListItem key={notification._id}>
              <ListItemText 
                primary={notification.message} 
                secondary={new Date(notification.date).toLocaleString()} 
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No notifications.
          </Typography>
        )}
      </List>
    </Container>
  );
};

export default Notifications;
