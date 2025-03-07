import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  GlobalStyles,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import '@fontsource/playfair-display/700.css';
import '@fontsource/poppins';

// Custom Styled Components
const GlowButton = styled(Button)(({ theme }) => ({
  background: '#2E7D32',
  color: '#FFF8E7',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '0 4px 15px rgba(46, 125, 50, 0.5)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#1B5E20',
    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.8)',
    transform: 'translateY(-2px)',
  },
}));

const LoginPage = ({ setUser }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpTroop, setSignUpTroop] = useState('wildOgrapher');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [borderOpacity, setBorderOpacity] = useState(1);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const opacity = Math.max(0, 1 - scrollY / maxScroll);
      setBorderOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoError = (e) => {
    const error = e.target.error;
    console.error('Video failed to load:', error ? error.message : 'Unknown error');
  };

  const handleVideoLoaded = () => {
    console.log('Video loaded successfully');
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Error logging in. Please try again later.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName,
          username: signUpUsername,
          troop: signUpTroop,
          email: signUpEmail,
          password: signUpPassword,
          avatar: '',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('Error signing up. Please try again later.');
    }
  };

  const loginForm = (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          },
          '& .MuiInputLabel-root': { color: '#1B3C34', fontWeight: 'bold' },
        }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          },
          '& .MuiInputLabel-root': { color: '#1B3C34', fontWeight: 'bold' },
        }}
      />
      <GlowButton type="submit" fullWidth sx={{ mt: 3 }}>
        Login
      </GlowButton>
      {errorMessage && (
        <Typography sx={{ mt: 2, color: '#D32F2F', textAlign: 'center' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  const signUpForm = (
    <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2 }}>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpName}
        onChange={(e) => setSignUpName(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          },
          '& .MuiInputLabel-root': { color: '#1B3C34', fontWeight: 'bold' },
        }}
      />
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpUsername}
        onChange={(e) => setSignUpUsername(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          },
          '& .MuiInputLabel-root': { color: '#1B3C34', fontWeight: 'bold' },
        }}
      />
      <FormControl fullWidth margin="normal" variant="outlined" required>
        <InputLabel sx={{ color: '#1B3C34', fontWeight: 'bold' }}>
          Troop
        </InputLabel>
        <Select
          value={signUpTroop}
          onChange={(e) => setSignUpTroop(e.target.value)}
          label="Troop"
          sx={{
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          }}
        >
          <MenuItem value="wildOgrapher">WildOgrapher</MenuItem>
          <MenuItem value="naturalist">Naturalist</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpEmail}
        onChange={(e) => setSignUpEmail(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          },
          '& .MuiInputLabel-root': { color: '#1B3C34', fontWeight: 'bold' },
        }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpPassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 248, 231, 0.9)',
            borderRadius: '8px',
            '& fieldset': { borderColor: '#2E7D32' },
            '&:hover fieldset': { borderColor: '#1B5E20' },
          },
          '& .MuiInputLabel-root': { color: '#1B3C34', fontWeight: 'bold' },
        }}
      />
      <GlowButton type="submit" fullWidth sx={{ mt: 3 }}>
        Sign Up
      </GlowButton>
      {errorMessage && (
        <Typography sx={{ mt: 2, color: '#D32F2F', textAlign: 'center' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes wave': {
            '0%': { backgroundPosition: '0 0' },
            '50%': { backgroundPosition: '-30px 0' },
            '100%': { backgroundPosition: '0 0' },
          },
        }}
      />
      <Box sx={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
        {/* Background Wildlife Video */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
            backgroundColor: '#F5F5F5',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={handleVideoError}
            onLoadedData={handleVideoLoaded}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source
              src="https://videos.pexels.com/video-files/855018/855018-sd_640_360_24fps.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </Box>

        {/* Waving Foliage Layer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '20vh',
            background:
              'linear-gradient(to top, rgba(46, 125, 50, 0.8), transparent), url(https://www.transparenttextures.com/patterns/green-leaves.png) repeat-x',
            backgroundSize: 'auto 100%',
            animation: 'wave 15s infinite ease-in-out',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Main Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, md: 4},
            py: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Box
              component="img"
              src="/logo.png" // Adjust this path if your logo is hosted elsewhere
              alt="Wildography Logo"
              sx={{
                width: '100%',
                maxWidth: { xs: 300, md: 450 }, // Increased from 250/350 to 300/400
                height: 'auto',
                mb: 4,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Paper
              elevation={10}
              sx={{
                p: 4,
                borderRadius: '16px',
                background: 'rgba(255, 248, 231, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid #2E7D32',
                maxWidth: 450,
                width: '100%',
              }}
            >
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                centered
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    color: '#1B3C34',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    fontFamily: '"Playfair Display", serif',
                  },
                  '& .Mui-selected': { color: '#2E7D32' },
                  '& .MuiTabs-indicator': { backgroundColor: '#2E7D32', height: 3 },
                }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
              {tabIndex === 0 ? loginForm : signUpForm}
            </Paper>
          </motion.div>

          <Typography
            variant="body1"
            sx={{
              mt: 3,
              color: '#1B3C34',
              fontFamily: '"Poppins", sans-serif',
              fontStyle: 'italic',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            Join the mission to protect our wild world.
          </Typography>
        </Box>

        {/* Wildlife Videos Section */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            py: 6,
            px: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Typography
              variant="h4"
              sx={{
                color: '#2E7D32',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 6,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              Wildlife Moments
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Box>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFF8E7',
                      fontFamily: '"Playfair Display", serif',
                      textAlign: 'center',
                      mb: 2,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      bgcolor: 'rgba(46, 125, 50, 0.7)',
                      py: 1,
                      borderRadius: '8px',
                      maxWidth: 300,
                      mx: 'auto',
                    }}
                  >
                    The Elephant’s Journey
                  </Typography>
                  <Box
                    component="video"
                    controls
                    muted
                    loop
                    src="https://videos.pexels.com/video-files/6821235/6821235-sd_640_360_30fps.mp4"
                    sx={{
                      width: '100%',
                      maxWidth: 800,
                      height: 450,
                      borderRadius: '12px',
                      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                      mx: 'auto',
                      display: 'block',
                      objectFit: 'cover',
                      border: '1px solid #2E7D32',
                    }}
                  />
                </motion.div>
              </Box>
              <Box>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFF8E7',
                      fontFamily: '"Playfair Display", serif',
                      textAlign: 'center',
                      mb: 2,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      bgcolor: 'rgba(46, 125, 50, 0.7)',
                      py: 1,
                      borderRadius: '8px',
                      maxWidth: 300,
                      mx: 'auto',
                    }}
                  >
                    Flight of the Eagle
                  </Typography>
                  <Box
                    component="video"
                    controls
                    muted
                    loop
                    src="https://videos.pexels.com/video-files/3635378/3635378-sd_640_360_30fps.mp4"
                    sx={{
                      width: '100%',
                      maxWidth: 800,
                      height: 450,
                      borderRadius: '12px',
                      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                      mx: 'auto',
                      display: 'block',
                      objectFit: 'cover',
                      border: '1px solid #2E7D32',
                    }}
                  />
                </motion.div>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: '#F9E4B7',
            color: '#1B3C34',
            py: 4,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            borderTop: '4px solid #2E7D32',
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: '"Poppins", sans-serif', mb: 1 }}
          >
            © {new Date().getFullYear()} Wildography. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"Poppins", sans-serif' }}>
            Protecting wildlife, one step at a time. Follow us on{' '}
            <Box
              component="a"
              href="#"
              sx={{
                color: '#2E7D32',
                textDecoration: 'none',
                fontWeight: 'bold',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Social Media
            </Box>
          </Typography>
        </Box>

        {/* Wildlife Silhouettes */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            opacity: 0.2,
            zIndex: 1,
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="#2E7D32">
            <path d="M23 7c-2.2-2-5.5-2-7.7 0L13 9.3 10.7 7C8.5 5 5.2 5 3 7l2 2 3.3 3.3L13 17l4.7-4.7L20 10l3-3z" />
          </svg>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '5%',
            opacity: 0.15,
            zIndex: 1,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="#2E7D32">
            <path d="M22 2v2h-2l-1 3h-4l-1-3H10l-1 3H5L4 4H2V2h20zM5 9l2 4h2l1-3h4l1 3h2l2-4H5zm-1 6v7h2v-5h12v5h2v-7H4z" />
          </svg>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;