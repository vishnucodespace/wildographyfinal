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
} from '@mui/material';
import { motion } from 'framer-motion';
import 'animate.css';

// Lion-inspired, sunlit theme variables
const accentColor = "#FFD700"; // Rich golden color
const bgColor = "#FFF8DC";     // Cornsilk, a light warm yellow
const textColor = "#3E2723";   // Dark brown for contrast

// Array of quotes for typewriter effect
const quotesArray = [
  "The Earth is what we all have in common. – Wendell Berry",
  "The greatest threat to our planet is the belief that someone else will save it. – Robert Swan",
  "Nature always wears the colors of the spirit. – Ralph Waldo Emerson",
  "In nature, nothing exists alone. – Rachel Carson",
];

// Articles for the Conservation section
const articles = [
  {
    id: 1,
    title: "Protecting the Coral Reefs",
    image:
      "https://images.pexels.com/photos/158607/corals-reef-ocean-sea-158607.jpeg?auto=compress&cs=tinysrgb",
    description:
      "Marine conservation efforts are restoring coral reefs, vital to marine biodiversity. These ecosystems provide shelter, food, and breeding grounds for countless species.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    title: "Deforestation Crisis",
    image:
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb",
    description:
      "Rapid deforestation is threatening wildlife habitats and accelerating climate change. Community-driven conservation programs aim to restore lost forests.",
    video: null,
  },
  {
    id: 3,
    title: "Reforestation Efforts",
    image:
      "https://images.pexels.com/photos/33109/fantasy-forest-trees-mist.jpg?auto=compress&cs=tinysrgb",
    description:
      "Reforestation initiatives transform barren lands into thriving forests, reviving ecosystems and sequestering carbon.",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
];

const LoginPage = ({ setUser }) => {
  const [tabIndex, setTabIndex] = useState(0);
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Sign Up form states
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpTroop, setSignUpTroop] = useState('wildOgrapher'); // default selection
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  // Error message state
  const [errorMessage, setErrorMessage] = useState("");

  // Typewriter effect states
  const [typedQuote, setTypedQuote] = useState("");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // Clear any previous errors when switching tabs
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any existing error
    try {
      const response = await fetch('http://localhost:5174/api/auth/login', {
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
        // Display error message from backend
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Error logging in. Please try again later.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch('http://localhost:5174/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: signUpName, 
          username: signUpUsername,
          troop: signUpTroop,
          email: signUpEmail, 
          password: signUpPassword, 
          avatar: '' 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Optionally, automatically log in the user after signup
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Error signing up. Please try again later.");
    }
  };

  // Typewriter effect for quotes
  useEffect(() => {
    let timer;
    const currentQuote = quotesArray[currentQuoteIndex];
    if (charIndex < currentQuote.length) {
      timer = setTimeout(() => {
        setTypedQuote((prev) => prev + currentQuote.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, 100);
    } else {
      timer = setTimeout(() => {
        setTypedQuote("");
        setCharIndex(0);
        setCurrentQuoteIndex((currentQuoteIndex + 1) % quotesArray.length);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [charIndex, currentQuoteIndex]);

  const loginForm = (
    <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleLogin}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        InputProps={{
          sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor },
        }}
        InputLabelProps={{ sx: { color: textColor } }}
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
        InputProps={{
          sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor },
        }}
        InputLabelProps={{ sx: { color: textColor } }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: accentColor,
          color: textColor,
          fontWeight: 'bold',
          boxShadow: `0 0 10px ${accentColor}`,
          '&:hover': { backgroundColor: "#FFC107" },
        }}
      >
        Login
      </Button>
      {errorMessage && (
        <Typography variant="body2" sx={{ mt: 2, color: "red" }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  const signUpForm = (
    <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSignUp}>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpName}
        onChange={(e) => setSignUpName(e.target.value)}
        InputProps={{
          sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor },
        }}
        InputLabelProps={{ sx: { color: textColor } }}
      />
      {/* Dropdown for Troop Selection */}
      <FormControl fullWidth margin="normal" variant="outlined" required>
        <InputLabel id="troop-select-label">Troop</InputLabel>
        <Select
          labelId="troop-select-label"
          id="troop-select"
          value={signUpTroop}
          label="Troop"
          onChange={(e) => setSignUpTroop(e.target.value)}
        >
          <MenuItem value="wildOgrapher">WildOgrapher</MenuItem>
          <MenuItem value="naturalist">Naturalist</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpUsername}
        onChange={(e) => setSignUpUsername(e.target.value)}
        InputProps={{
          sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor },
        }}
        InputLabelProps={{ sx: { color: textColor } }}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpEmail}
        onChange={(e) => setSignUpEmail(e.target.value)}
        InputProps={{
          sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor },
        }}
        InputLabelProps={{ sx: { color: textColor } }}
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
        InputProps={{
          sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor },
        }}
        InputLabelProps={{ sx: { color: textColor } }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: accentColor,
          color: textColor,
          fontWeight: 'bold',
          boxShadow: `0 0 10px ${accentColor}`,
          '&:hover': { backgroundColor: "#FFC107" },
        }}
      >
        Sign Up
      </Button>
      {errorMessage && (
        <Typography variant="body2" sx={{ mt: 2, color: "red" }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Login/Sign Up Section with Scrolling Background Video */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          minHeight: '100vh',
          overflow: 'hidden',
          backgroundColor: bgColor,
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 0,
            border: 'none',
          }}
        >
          <source src="https://videos.pexels.com/video-files/18553643/18553643-sd_640_360_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Light Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.3)',
            zIndex: -2,
          }}
        />
        {/* Login/Sign Up Container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            minHeight: '100vh',
            px: 2,
          }}
        >
          {/* Floating Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{
                mb: 3,
                color: accentColor,
                fontFamily: '"Roboto Slab", serif',
              }}
            >
              WildOGraphy
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="animate__animated animate__fadeIn"
          >
            <Paper
              elevation={12}
              sx={{
                p: 4,
                maxWidth: 400,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: 'blur(10px)',
                border: `2px solid ${accentColor}`,
                boxShadow: `0 0 20px ${accentColor}`,
              }}
            >
              <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
              {tabIndex === 0 ? loginForm : signUpForm}
              <Typography variant="body2" align="center" sx={{ mt: 2, color: accentColor }}>
                Discover breathtaking wildlife moments, share your experiences, and connect with nature enthusiasts.
              </Typography>
            </Paper>
          </motion.div>
          {/* Typewriter Quote Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: accentColor,
                fontFamily: '"Roboto Slab", serif',
              }}
            >
              {typedQuote}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Conservation & Environmental Stories Section */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "rgba(210, 180, 140, 0.8)",
          borderTop: `4px solid ${accentColor}`,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: accentColor }}>
          Conservation & Environmental Stories
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mx: { xs: 2, md: 10 } }}>
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Paper elevation={4} sx={{ p: 2, borderRadius: 2, backgroundColor: "#FFFDE7", boxShadow: `0 0 15px ${accentColor}` }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' }, alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    {article.video ? (
                      <video controls style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                        <source src={article.video} type="video/mp4" />
                        Your browser does not support video.
                      </video>
                    ) : (
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, p: 1 }}>
                    <Typography variant="h5" sx={{ mb: 1, color: accentColor, fontWeight: 'bold' }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: textColor }}>
                      {article.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5D4037" }}>
                      Wildlife conservation is not just about protecting nature—it is about preserving life itself.
                      Every effort contributes to a better future for all living creatures.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#D2B48C",
          color: accentColor,
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} WildOGraphy. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Follow us on{' '}
          <a href="#" style={{ color: accentColor, textDecoration: 'none' }}>
            Social Media
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
