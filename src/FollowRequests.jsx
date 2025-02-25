import React, { useState, useEffect } from 'react';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Typography 
} from '@mui/material';

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
        // Remove the accepted request from the list
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
        // Optionally, remove the request or update its status as needed
        setRequests(prev => prev.filter(r => r.fromUser !== requesterId));
      } else {
        console.error('Error following back:', data.error);
      }
    } catch (error) {
      console.error('Error following back:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Follow Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No follow requests.
        </Typography>
      ) : (
        <List>
          {requests.map((request) => (
            <ListItem key={request._id} divider>
              <ListItemText 
                primary={request.message} 
                secondary={`From User ID: ${request.fromUser}`}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleAccept(request.fromUser)}
              >
                Accept
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                sx={{ ml: 1 }} 
                onClick={() => handleReject(request.fromUser)}
              >
                Reject
              </Button>
              <Button 
                variant="outlined" 
                sx={{ ml: 1 }} 
                onClick={() => handleFollowBack(request.fromUser)}
              >
                Follow Back
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default FollowRequests;
