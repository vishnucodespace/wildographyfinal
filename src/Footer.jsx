// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

const Footer = () => {
  const { scrollY } = useViewportScroll();
  // Fade in the footer as you scroll down
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  return (
    <motion.footer
      style={{
        opacity,
        backgroundColor: '#1f1f1f',
        color: '#fff',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1">
        © 2025 Wild O' Graphy. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="/contact" color="inherit" underline="hover">
          Contact Us
        </Link>
      </Typography>
    </motion.footer>
  );
};

export default Footer;
