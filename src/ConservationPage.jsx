import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'animate.css';

// Extended articles list with additional topics (including deforestation)
const articles = [
  {
    id: 1,
    title: 'Protecting the Coral Reefs',
    image:
      'https://images.pexels.com/photos/158607/corals-reef-ocean-sea-158607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description:
      'Learn how marine conservation efforts are helping to restore coral reefs.',
    content:
      'Coral reefs are among the most diverse ecosystems on earth. Efforts include reducing pollution, sustainable fishing, and creating marine reserves to ensure their survival.'
  },
  {
    id: 2,
    title: 'Forest Conservation Initiatives',
    image:
      'https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description:
      'Discover projects aimed at protecting and reforesting our forests.',
    content:
      'Forests play a crucial role in maintaining biodiversity and regulating the climate. Many organizations are investing in reforestation and sustainable forest management.'
  },
  {
    id: 3,
    title: 'Saving Endangered Species',
    image:
      'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description:
      'Explore how conservationists are protecting animals on the brink of extinction.',
    content:
      'Endangered species face threats from habitat loss and poaching. Conservation programs and wildlife sanctuaries help safeguard these precious animals.'
  },
  {
    id: 4,
    title: 'Deforestation and Its Impact',
    image:
      'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description:
      'The alarming rate of deforestation and what can be done to stop it.',
    content:
      'Deforestation is leading to significant loss of biodiversity, contributing to climate change and disrupting local communities. Conservation efforts focus on sustainable practices and reforestation.'
  },
  {
    id: 5,
    title: 'Combating Wildlife Trafficking',
    image:
      'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description:
      'Tackling the illegal wildlife trade to save endangered species.',
    content:
      'Wildlife trafficking is a multi-billion-dollar industry threatening many species. Enhanced law enforcement and international cooperation are crucial to curb this illicit trade.'
  }
];

// Create a custom MUI theme with a navy blue neon palette
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#001f3f' // Navy blue background
    },
    primary: {
      main: '#39ff14' // Neon green accent
    },
    text: {
      primary: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

const ConservationPage = () => {
  // Create refs for each article and section element
  const elementRefs = useRef([]);

  // Set up IntersectionObserver to add animation classes on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elementRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elementRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Scroll smoothly to a particular section
  const scrollToSection = (index) => {
    if (elementRefs.current[index]) {
      elementRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary'
        }}
      >
        {/* Navigation AppBar */}
        <AppBar
          position="sticky"
          color="transparent"
          sx={{
            boxShadow: 'none',
            background: 'rgba(0, 31, 63, 0.8)',
            py: 1
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
            {articles.map((article, index) => (
              <Button
                key={article.id}
                color="primary"
                onClick={() => scrollToSection(index)}
                sx={{ mx: 1, textTransform: 'none', fontWeight: 'bold' }}
              >
                {article.title}
              </Button>
            ))}
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 4, textShadow: '0 0 10px #39ff14' }}
          >
            Conservation Corner: Wildlife & Environment
          </Typography>

          {/* Articles Section */}
          <Grid container spacing={4}>
            {articles.map((article, index) => (
              <Grid item key={article.id} xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    height: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#012a4a',
                    border: '2px solid #39ff14',
                    borderRadius: '10px',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 0 15px #39ff14'
                    }
                  }}
                  ref={(el) => (elementRefs.current[index] = el)}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      maxHeight: '250px',
                      objectFit: 'cover'
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {article.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {article.content}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Videos Section */}
          <Box
            sx={{ mt: 8 }}
            ref={(el) => (elementRefs.current[articles.length] = el)}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ textShadow: '0 0 10px #39ff14' }}
            >
              Watch: Conservation in Action
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#012a4a',
                    border: '2px solid #39ff14',
                    borderRadius: '10px'
                  }}
                >
                  <video
                    controls
                    style={{
                      width: '100%',
                      borderRadius: '8px'
                    }}
                  >
                    <source
                      src="https://www.w3schools.com/html/mov_bbb.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Wildlife Conservation Efforts
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#012a4a',
                    border: '2px solid #39ff14',
                    borderRadius: '10px'
                  }}
                >
                  <video
                    controls
                    style={{
                      width: '100%',
                      borderRadius: '8px'
                    }}
                  >
                    <source
                      src="https://www.w3schools.com/html/movie.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    The Fight Against Deforestation
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ConservationPage;
