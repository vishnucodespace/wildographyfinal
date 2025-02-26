import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Updated articles list with Wikipedia links
const articles = [
  {
    id: 1,
    title: 'Protecting the Coral Reefs',
    image:
      'https://images.pexels.com/photos/158607/corals-reef-ocean-sea-158607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Efforts to restore and protect coral ecosystems.',
    wikiLink: 'https://en.wikipedia.org/wiki/Coral_reef_protection',
  },
  {
    id: 2,
    title: 'Forest Conservation Initiatives',
    image:
      'https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Projects aimed at preserving forest biodiversity.',
    wikiLink: 'https://en.wikipedia.org/wiki/Forest_conservation',
  },
  {
    id: 3,
    title: 'Saving Endangered Species',
    image:
      'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Protecting animals from extinction.',
    wikiLink: 'https://en.wikipedia.org/wiki/Endangered_species',
  },
  {
    id: 4,
    title: 'Deforestation and Its Impact',
    image:
      'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Addressing the consequences of deforestation.',
    wikiLink: 'https://en.wikipedia.org/wiki/Deforestation',
  },
  {
    id: 5,
    title: 'Combating Wildlife Trafficking',
    image:
      'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Stopping the illegal wildlife trade.',
    wikiLink: 'https://en.wikipedia.org/wiki/Wildlife_trade',
  },
];

// Create a custom MUI theme with an earthy palette supporting both light and dark modes
const theme = createTheme({
  palette: {
    mode: 'dark', // Toggle to 'light' or use a prop/context for dynamic switching
    background: {
      default: '#1a2e2a', // Deep forest green (dark mode)
      paper: '#2e4a44',   // Slightly lighter green (dark mode)
    },
    primary: {
      main: '#8ba698',    // Muted sage green for accents
      dark: '#6b8476',    // Darker variant for hover
      contrastText: '#ffffff',
    },
    text: {
      primary: '#f5f5f5', // Off-white for readability (dark mode)
      secondary: '#d1d9d5', // Light gray (dark mode)
    },
    ...(createTheme().palette.mode === 'light' && { // Light mode overrides
      background: {
        default: '#f5f7f6', // Light greenish-gray
        paper: '#ffffff',   // White for cards
      },
      text: {
        primary: '#1a2e2a', // Dark green for readability
        secondary: '#64748b', // Slate gray
      },
    }),
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600 },
    body2: { fontWeight: 400, lineHeight: 1.6 },
  },
});

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const ConservationPage = () => {
  // Handle article click to open Wikipedia link
  const handleArticleClick = (wikiLink) => {
    window.open(wikiLink, '_blank'); // Opens in a new tab
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary',
          px: { xs: 2, sm: 4 },
          py: 6,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              mb: 6,
              color: 'primary.main',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                bgcolor: 'primary.main',
                borderRadius: 2,
              },
            }}
          >
            Conservation Corner
          </Typography>

          {/* Articles Section */}
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleArticleClick(article.wikiLink)}
                  >
                    <Box
                      component="img"
                      src={article.image}
                      alt={article.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2,
                        '&:hover': {
                          opacity: 0.95,
                        },
                        transition: 'opacity 0.2s ease',
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 2,
                      }}
                    >
                      {article.description}
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(139,166,152,0.1)' : '#f0f2f0',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ConservationPage;