import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import WavesIcon from '@mui/icons-material/Waves';
import ParkIcon from '@mui/icons-material/Park';
import PetsIcon from '@mui/icons-material/Pets';
import NatureIcon from '@mui/icons-material/Nature';
import BugReportIcon from '@mui/icons-material/BugReport';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import '@fontsource/playfair-display/700.css';
import '@fontsource/poppins';

const articles = [
  {
    id: 1,
    title: 'Protecting the Coral Reefs',
    image: 'https://images.pexels.com/photos/158607/corals-reef-ocean-sea-158607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Discover efforts like coral nurseries and Marine Protected Areas saving fragile reef ecosystems.',
    wikiLink: 'https://en.wikipedia.org/wiki/Coral_reef_protection',
    icon: <WavesIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
  {
    id: 2,
    title: 'Forest Conservation Initiatives',
    image: 'https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Learn how reforestation and sustainable management preserve forest biodiversity globally.',
    wikiLink: 'https://en.wikipedia.org/wiki/Forest_management',
    icon: <ParkIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
  {
    id: 3,
    title: 'Saving Endangered Species',
    image: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Efforts like captive breeding have brought species like the bald eagle back from the brink.',
    wikiLink: 'https://en.wikipedia.org/wiki/Endangered_species',
    icon: <PetsIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
  {
    id: 4,
    title: 'Deforestation’s Lasting Impact',
    image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Explore the consequences of deforestation and efforts to mitigate it worldwide.',
    wikiLink: 'https://en.wikipedia.org/wiki/Forest_management#Deforestation',
    icon: <NatureIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
  {
    id: 5,
    title: 'Combating Wildlife Trafficking',
    image: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Brazil’s fight against wildlife smuggling targets the illegal trade threatening biodiversity.',
    wikiLink: 'https://en.wikipedia.org/wiki/Endangered_species#In_Brazil',
    icon: <BugReportIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
  {
    id: 6,
    title: 'Golden Lion Tamarin Revival',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Leontopithecus_rosalia_no_Parque_Nacional_da_Tijuca.jpg/800px-Leontopithecus_rosalia_no_Parque_Nacional_da_Tijuca.jpg',
    description: 'A Brazilian success story: how awareness campaigns saved this endemic primate.',
    wikiLink: 'https://en.wikipedia.org/wiki/Endangered_species#In_Brazil',
    icon: <NatureIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
  {
    id: 7,
    title: 'Hawaiian Monk Seal Recovery',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Monk_seal_lying_on_back.jpg/800px-Monk_seal_lying_on_back.jpg',
    description: 'Conservation efforts stabilize one of the world’s most endangered seals.',
    wikiLink: 'https://en.wikipedia.org/wiki/Endangered_species#Conservation',
    icon: <FlightTakeoffIcon sx={{ mr: 1, color: 'primary.main' }} />,
  },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const ConservationPage = ({ darkMode }) => {
  const handleArticleClick = (wikiLink) => {
    window.open(wikiLink, '_blank');
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        color: 'text.primary',
        px: { xs: 2, sm: 4, md: 6 },
        py: 8,
        transition: 'background-color 0.5s ease',
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Hero Section with Fixed Background */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Box
            sx={{
              position: 'relative',
              height: { xs: '50vh', md: '70vh' },
              backgroundImage: `url('https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed', // Ensure fixed background
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 8,
              borderRadius: 10,
              overflow: 'hidden', // Prevent overflow issues
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0,0,0,0.6)',
                zIndex: 1,
              }}
            />
            <Box sx={{ zIndex: 2, textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontFamily: '"Playfair Display", serif',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                  animation: (theme) => `${theme.animations.fadeIn} 1s ease-out`,
                }}
              >
                Conservation Chronicles
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#E0E0E0', // Slightly lighter for contrast on overlay
                  mt: 2,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  animation: (theme) => `${theme.animations.fadeIn} 1s ease-out 0.3s both`,
                }}
              >
                Stories of resilience, recovery, and hope for our planet.
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Articles Section */}
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontFamily: '"Playfair Display", serif',
            textAlign: 'center',
            color: 'primary.main',
            animation: (theme) => `${theme.animations.fadeIn} 0.8s ease-out`,
          }}
        >
          Explore Conservation Stories
        </Typography>
        <Divider sx={{ mb: 6, borderColor: 'primary.main', opacity: 0.5 }} />
        <Grid container spacing={4}>
          {articles.map((article, index) => (
            <Grid item key={article.id} xs={12} sm={6} md={4}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 10,
                    transition: 'all 0.3s ease',
                    animation: (theme) => `${theme.animations.float} 3s ease-in-out infinite`,
                  }}
                  onClick={() => handleArticleClick(article.wikiLink)}
                >
                  <Box
                    component="img"
                    src={article.image}
                    alt={article.title}
                    sx={{
                      width: '100%',
                      height: 220,
                      objectFit: 'cover',
                      borderRadius: 8,
                      mb: 2,
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)' },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    {article.icon}
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {article.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    {article.description}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ px: 3 }}>
                    Dive In
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ConservationPage;