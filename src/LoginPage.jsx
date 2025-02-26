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

// Color scheme: forest green, soft sand, and ivory
const accentColor = "#2E7D32";  // Deep forest green
const bgColor = "#F9E4B7";      // Soft sand/ivory
const textColor = "#1B3C34";    // Dark teal for contrast
const secondaryColor = "#FFF8E7"; // Light ivory for backgrounds

// Array of quotes with enhanced typewriter effect
const quotesArray = [
  "The clearest way into the Universe is through a forest wilderness. – John Muir",
  "We do not inherit the earth from our ancestors; we borrow it from our children. – Native American Proverb",
  "The earth has music for those who listen. – George Santayana",
  "Look deep into nature, and then you will understand everything better. – Albert Einstein",
];

// Real conservation stories with links
const articles = [
  {
    id: 1,
    title: "Saving the Great Barrier Reef",
    image: "https://images.unsplash.com/photo-1624453125687-f6c3cfcd3d9f?auto=format&fit=crop&w=800",
    description: "Efforts to combat coral bleaching and restore Australia's Great Barrier Reef, a critical ecosystem under threat.",
    link: "https://www.worldwildlife.org/stories/saving-the-great-barrier-reef",
  },
  {
    id: 2,
    title: "Amazon Rainforest Conservation",
    image: "https://images.unsplash.com/photo-1501466044931-62695aada8ec?auto=format&fit=crop&w=800",
    description: "Initiatives to halt deforestation in the Amazon, protecting biodiversity and indigenous communities.",
    link: "https://www.rainforestfoundation.org/amazon-rainforest-conservation/",
  },
  {
    id: 3,
    title: "Rhino Recovery in Africa",
    image: "https://images.unsplash.com/photo-1581852016528-ffbdf489dbfe?auto=format&fit=crop&w=800",
    description: "Conservation programs boosting rhino populations in Africa through anti-poaching and habitat restoration.",
    link: "https://www.savetherhino.org/africa/",
  },
];

const LoginPage = ({ setUser }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpTroop, setSignUpTroop] = useState('wildOgrapher');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [typedQuote, setTypedQuote] = useState("");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Error signing up. Please try again later.");
    }
  };

  // Enhanced typewriter effect
  useEffect(() => {
    let timer;
    const currentQuote = quotesArray[currentQuoteIndex];
    if (isTyping && charIndex < currentQuote.length) {
      timer = setTimeout(() => {
        setTypedQuote((prev) => prev + currentQuote.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, 80);
    } else if (charIndex === currentQuote.length) {
      setIsTyping(false);
      timer = setTimeout(() => {
        setIsTyping(true);
        setTypedQuote("");
        setCharIndex(0);
        setCurrentQuoteIndex((currentQuoteIndex + 1) % quotesArray.length);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [charIndex, currentQuoteIndex, isTyping]);

  const loginForm = (
    <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleLogin}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        InputProps={{
          sx: {
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          },
        }}
        InputLabelProps={{ sx: { color: textColor, fontWeight: 'bold' } }}
        sx={{ '&:hover fieldset': { borderColor: accentColor } }}
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
          sx: {
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          },
        }}
        InputLabelProps={{ sx: { color: textColor, fontWeight: 'bold' } }}
        sx={{ '&:hover fieldset': { borderColor: accentColor } }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          py: 1.5,
          backgroundColor: accentColor,
          color: secondaryColor,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: "#1B5E20",
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Login
      </Button>
      {errorMessage && (
        <Typography variant="body2" sx={{ mt: 2, color: "#D32F2F", fontStyle: 'italic' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  const signUpForm = (
    <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSignUp}>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={signUpName}
        onChange={(e) => setSignUpName(e.target.value)}
        InputProps={{
          sx: {
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          },
        }}
        InputLabelProps={{ sx: { color: textColor, fontWeight: 'bold' } }}
        sx={{ '&:hover fieldset': { borderColor: accentColor } }}
      />
      <FormControl fullWidth margin="normal" variant="outlined" required>
        <InputLabel id="troop-select-label" sx={{ color: textColor, fontWeight: 'bold' }}>
          Troop
        </InputLabel>
        <Select
          labelId="troop-select-label"
          id="troop-select"
          value={signUpTroop}
          label="Troop"
          onChange={(e) => setSignUpTroop(e.target.value)}
          sx={{
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          }}
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
          sx: {
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          },
        }}
        InputLabelProps={{ sx: { color: textColor, fontWeight: 'bold' } }}
        sx={{ '&:hover fieldset': { borderColor: accentColor } }}
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
          sx: {
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          },
        }}
        InputLabelProps={{ sx: { color: textColor, fontWeight: 'bold' } }}
        sx={{ '&:hover fieldset': { borderColor: accentColor } }}
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
          sx: {
            backgroundColor: secondaryColor,
            color: textColor,
            borderRadius: 2,
            '& fieldset': { borderColor: accentColor },
          },
        }}
        InputLabelProps={{ sx: { color: textColor, fontWeight: 'bold' } }}
        sx={{ '&:hover fieldset': { borderColor: accentColor } }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          py: 1.5,
          backgroundColor: accentColor,
          color: secondaryColor,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: "#1B5E20",
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Sign Up
      </Button>
      {errorMessage && (
        <Typography variant="body2" sx={{ mt: 2, color: "#D32F2F", fontStyle: 'italic' }}>
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
            zIndex: 1,
          },
        }}
      >
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
            maxWidth: 450,
            p: 4,
            mt: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{
                mb: 4,
                color: secondaryColor,
                fontFamily: '"Dancing Script", cursive', // Cursive font for title
                fontWeight: '700',
                fontSize: { xs: '2.5rem', md: '3.5rem' }, // Responsive size
                textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
                letterSpacing: '2px',
              }}
            >
              Wildography
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Paper
              elevation={16}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "rgba(255,248,231,0.95)",
                border: `3px solid ${accentColor}`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.25)`,
              }}
            >
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                centered
                sx={{
                  mb: 2,
                  '& .MuiTab-root': {
                    color: textColor,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    fontFamily: '"Playfair Display", serif',
                  },
                  '& .Mui-selected': {
                    color: accentColor,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: accentColor,
                    height: 3,
                  },
                }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
              {tabIndex === 0 ? loginForm : signUpForm}
              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 3,
                  color: textColor,
                  fontStyle: 'italic',
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Join us in preserving the wonders of wildlife.
              </Typography>
            </Paper>
          </motion.div>
        </Box>
        {/* Typewriter Quote */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            textAlign: 'center',
            pb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: secondaryColor,
              fontFamily: '"Dancing Script", cursive', // Cursive font for quotes
              fontWeight: '400',
              fontSize: { xs: '1.2rem', md: '1.5rem' }, // Responsive size
              textShadow: '1px 1px 6px rgba(0,0,0,0.7)',
              px: 2,
              maxWidth: '80%',
              mx: 'auto',
              animation: 'pulse 2s infinite',
            }}
          >
            {typedQuote}
          </Typography>
        </Box>
      </Box>

      {/* Conservation & Wildlife Stories Section */}
      <Box sx={{ p: { xs: 4, md: 6 }, backgroundColor: bgColor }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: accentColor,
            fontFamily: '"Playfair Display", serif',
            textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
            mb: 5,
          }}
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
                transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: `0 6px 20px rgba(0,0,0,0.15)`,
                    backgroundColor: secondaryColor,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 12px 30px rgba(0,0,0,0.25)`,
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={article.image}
                    alt={article.title}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: accentColor,
                        fontWeight: 'bold',
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, color: textColor, lineHeight: 1.6 }}
                    >
                      {article.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        mt: 2,
                        color: accentColor,
                        borderColor: accentColor,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        px: 3,
                        '&:hover': {
                          backgroundColor: accentColor,
                          color: secondaryColor,
                          borderColor: accentColor,
                        },
                        transition: 'all 0.3s ease',
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
          color: secondaryColor,
          py: 4,
          textAlign: 'center',
          borderTop: `4px solid ${bgColor}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontFamily: '"Playfair Display", serif', mb: 1 }}
        >
          © {new Date().getFullYear()} Wildography. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: '"Playfair Display", serif' }}>
          Follow us on{' '}
          <a
            href="#"
            style={{
              color: bgColor,
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Social Media
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;