// src/components/SearchPeoplePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardContent, Avatar, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';

const SearchPeoplePage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/users');
        if (!response.ok) {
          console.error("Server responded with status:", response.status);
          return;
        }
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const results = users.filter((user) => {
        console.log("Filtering user:", user);
        return (
          (user.username && user.username.toLowerCase().includes(query)) ||
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query))
        );
      });
      console.log("Filtered results:", results);
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
                  <CardContent>
                    <Typography variant="h6">{user.username || user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.name || user.email}
                    </Typography>
                  </CardContent>
                  <Button variant="outlined" sx={{ ml: 'auto' }}>
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
