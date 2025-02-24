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
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { motion } from 'framer-motion';
import 'animate.css';

// Refined nature-inspired theme variables
const accentColor = "#DAA520"; // Deeper gold for sophistication
const bgColor = "#F5F5DC";     // Muted earthy beige
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
    title: "The Last Stand of the Coral Reefs",
    image: "https://images.pexels.com/photos/158607/corals-reef-ocean-sea-158607.jpeg?auto=compress&cs=tinysrgb",
    description: "Marine conservationists fight to restore coral reefs, fragile ecosystems teeming with life, now fading under climate pressures.",
  },
  {
    id: 2,
    title: "The Silent Deforestation Crisis",
    image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb",
    description: "Forests vanish at alarming rates, displacing wildlife and warming our planet. Every tree lost is a story erased.",
  },
  {
    id: 3,
    title: "A Rhino’s Tale of Survival",
    image: "https://images.pexels.com/photos/33109/fantasy-forest-trees-mist.jpg?auto=compress&cs=tinysrgb",
    description: "One rhino’s journey through a reforested sanctuary reflects hope amid the battle against poaching and habitat loss.",
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
  const [signUpTroop, setSignUpTroop] = useState('wildOgrapher');
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
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
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
          avatar: '',
        }),
      });
      const data = await response.json();
      if (response.ok) {
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
        InputProps={{ sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor } }}
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
        InputProps={{ sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor } }}
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
        InputProps={{ sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor } }}
        InputLabelProps={{ sx: { color: textColor } }}
      />
      <FormControl fullWidth margin="normal" variant="outlined" required>
        <InputLabel id="troop-select-label" sx={{ color: textColor }}>Troop</InputLabel>
        <Select
          labelId="troop-select-label"
          id="troop-select"
          value={signUpTroop}
          label="Troop"
          onChange={(e) => setSignUpTroop(e.target.value)}
          sx={{ backgroundColor: "rgba(255,255,255,0.9)", color: textColor }}
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
        InputProps={{ sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor } }}
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
        InputProps={{ sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor } }}
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
        InputProps={{ sx: { backgroundColor: "rgba(255,255,255,0.9)", color: textColor } }}
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
    <Box sx={{ width: '100vw', overflowX: 'hidden', backgroundColor: bgColor }}>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.pexels.com/photos/47547/forest-trees-path-wilderness-47547.jpeg?auto=compress&cs=tinysrgb)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        />
        {/* Login/Sign Up Container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 400,
            p: 4,
          }}
        >
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
                color: '#fff',
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Wildography
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Paper
              elevation={12}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.9)",
                border: `2px solid ${accentColor}`,
              }}
            >
              <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
              {tabIndex === 0 ? loginForm : signUpForm}
              <Typography variant="body2" align="center" sx={{ mt: 2, color: textColor }}>
                Join us in preserving the wonders of wildlife.
              </Typography>
            </Paper>
          </motion.div>
          {/* Typewriter Quote */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '5%',
              width: '100%',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
              }}
            >
              {typedQuote}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Conservation & Wildlife Stories Section */}
      <Box sx={{ p: 4, backgroundColor: bgColor }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: accentColor, fontFamily: '"Playfair Display", serif' }}
        >
          Stories of the Wild
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {articles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                  />
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 1, color: accentColor, fontWeight: 'bold' }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: textColor }}>
                      {article.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2, color: accentColor, borderColor: accentColor }}
                      onClick={() => {
                        // Placeholder for future modal or navigation
                        console.log(`Read more about ${article.title}`);
                      }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: accentColor,
          color: '#fff',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Wildography. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Follow us on{' '}
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
            Social Media
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;