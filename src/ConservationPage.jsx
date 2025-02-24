import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

// Create a custom MUI theme with an earthy, professional palette
const theme = createTheme({
  palette: {
    mode: 'dark', // Can toggle to 'light' for a lighter version
    background: {
      default: '#1a2e2a', // Deep forest green background
      paper: '#2e4a44', // Slightly lighter green for cards
    },
    primary: {
      main: '#8ba698', // Muted sage green for accents
    },
    text: {
      primary: '#f5f5f5', // Off-white for readability
      secondary: '#d1d9d5', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body2: { fontWeight: 400 },
  },
});

const ConservationPage = () => {
  // Handle article click to open Wikipedia link
  const handleArticleClick = (wikiLink) => {
    window.open(wikiLink, '_blank'); // Opens in a new tab
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary',
          px: 2,
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6, color: 'primary.main' }}
          >
            Conservation Corner
          </Typography>

          {/* Articles Section */}
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                    },
                  }}
                  onClick={() => handleArticleClick(article.wikiLink)}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {article.description}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    sx={{ mt: 1, textTransform: 'none' }}
                  >
                    Learn More
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ConservationPage;