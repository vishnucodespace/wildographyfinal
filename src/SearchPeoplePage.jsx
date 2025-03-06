import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardContent, Avatar, Typography, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL ;

const SearchPeoplePage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from the backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users`);
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
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 6, 
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 4,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: 2,
          },
        }}
      >
        Search People
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 5,
        }}
      >
        <TextField 
          label="Search by name, username, or email"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: '100%', sm: '70%', md: '60%' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '&.Mui-focused fieldset': { 
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              color: 'text.secondary',
              '&.Mui-focused': { color: 'primary.main' },
            },
          }}
        />
      </Box>
      {filteredUsers.length > 0 ? (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item key={user._id || user.id} xs={12} sm={6} md={4}>
              <motion.div 
                whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }} 
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar 
                    src={user.avatar} 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      mr: 2,
                      border: (theme) => `2px solid ${theme.palette.divider}`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }} 
                  />
                  <CardContent sx={{ flexGrow: 1, py: 1 }}>
                    <Typography 
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {user.username || user.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: 'text.secondary',
                        mt: 0.5,
                      }}
                    >
                      {user.name || user.email}
                    </Typography>
                  </CardContent>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      ml: 'auto',
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(66,165,245,0.1)' : '#f0f7ff',
                        borderColor: 'primary.dark',
                      },
                    }} 
                    onClick={() => {
                      const storedUser = localStorage.getItem('user');
                      const currentUser = storedUser ? JSON.parse(storedUser) : null;
                      navigate(`/viewprofile/${user._id || user.id}`, { state: { currentUser } });
                    }}
                  >
                    View Profile
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mt: 4,
            color: 'text.secondary',
            bgcolor: 'background.default',
            py: 2,
            borderRadius: 2,
            fontStyle: 'italic',
          }}
        >
          No users found.
        </Typography>
      )}
    </Container>
  );
};

export default SearchPeoplePage;
