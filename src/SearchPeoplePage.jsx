// src/SearchPeoplePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardContent, Avatar, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SearchPeoplePage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from the backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/users');
        const data = await response.json();
        console.log("Fetched users:", data); // Check the output here
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on the search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const results = users.filter((user) =>
        (user.username && user.username.toLowerCase().includes(query)) ||
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
      console.log("Filtered results:", results); // Check filtering output
      setFilteredUsers(results);
    }
  }, [searchQuery, users]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search People
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField 
          label="Search by name, username, or email"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '60%' }}
        />
      </Box>
      {filteredUsers.length > 0 ? (
        <Grid container spacing={2}>
          {filteredUsers.map((user) => (
            <Grid item key={user._id || user.id} xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Avatar src={user.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{user.username || user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.name || user.email}</Typography>
                  </CardContent>
                  <Button 
                    variant="outlined" 
                    sx={{ ml: 'auto' }} 
                    onClick={() => navigate(`/viewprofile/${user._id || user.id}`)}
                  >
                    View Profile
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          No users found.
        </Typography>
      )}
    </Container>
  );
};

export default SearchPeoplePage;
