// src/FollowersPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const FollowersPage = () => {
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/users/${userId}/followers`);
        if (!response.ok) throw new Error('Failed to fetch followers');
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Followers
      </Typography>
      {followers.length === 0 ? (
        <Typography variant="body1">No followers found.</Typography>
      ) : (
        <List>
          {followers.map((follower) => (
            <React.Fragment key={follower._id}>
              <ListItem button onClick={() => navigate(`/viewprofile/${follower._id}`)}>
                <Avatar src={follower.avatar} alt={follower.username || follower.name} sx={{ mr: 2 }} />
                <ListItemText
                  primary={follower.username || follower.name}
                  secondary={follower.email}
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

export default FollowersPage;
