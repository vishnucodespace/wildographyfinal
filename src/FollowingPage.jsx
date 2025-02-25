// src/FollowingPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const FollowingPage = () => {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/users/${userId}/following`);
        if (!response.ok) throw new Error('Failed to fetch following');
        const data = await response.json();
        setFollowing(data);
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    };

    fetchFollowing();
  }, [userId]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Following
      </Typography>
      {following.length === 0 ? (
        <Typography variant="body1">Not following anyone.</Typography>
      ) : (
        <List>
          {following.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem button onClick={() => navigate(`/viewprofile/${user._id}`)}>
                <Avatar src={user.avatar} alt={user.username || user.name} sx={{ mr: 2 }} />
                <ListItemText
                  primary={user.username || user.name}
                  secondary={user.email}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default FollowingPage;
