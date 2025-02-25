import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './LoginPage';
import ClippedDrawer from './ClippedDrawer';

// Define palettes for light and dark modes
const lightPalette = {
  mode: 'light',
  primary: { main: '#2E7D32' }, // Deep forest green
  secondary: { main: '#E2725B' }, // Terracotta
  background: { default: '#F5F0E1', paper: '#FFFFFF' }, // Warm beige and white
  text: { primary: '#424242' }, // Dark charcoal gray
};

const darkPalette = {
  mode: 'dark',
  primary: { main: '#66BB6A' }, // Lighter green for visibility
  secondary: { main: '#FF8A65' }, // Lighter terracotta
  background: { default: '#121212', paper: '#1E1E1E' }, // Dark gray tones
  text: { primary: '#E0E0E0' }, // Light gray
};

// Create theme function
const theme = (darkMode) =>
  createTheme({
    palette: darkMode ? darkPalette : lightPalette,
    typography: {
      fontFamily: '"Poppins", sans-serif', // Modern and stylish
      button: { textTransform: 'none', fontWeight: 'bold' },
    },
    components: {
      MuiButton: {
        styleOverrides: { root: { borderRadius: 6, fontWeight: 'bold' } },
      },
      MuiPaper: {
        styleOverrides: { root: { borderRadius: 10, boxShadow: 'none' } },
      },
    },
  });

const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={theme(darkMode)}>
      <Routes>
        <Route
          path="/*"
          element={
            !user ? (
              <LoginPage setUser={setUser} />
            ) : (
              <ClippedDrawer
                user={user}
                setUser={setUser}
                toggleDarkMode={toggleDarkMode}
                darkMode={darkMode}
              />
            )
          }
        />
        <Route
          path="/*"
          element={
            user ? (
              <ClippedDrawer
                user={user}
                setUser={setUser}
                toggleDarkMode={toggleDarkMode}
                darkMode={darkMode}
              />
            ) : (
              <Navigate to="/*" />
            )
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;