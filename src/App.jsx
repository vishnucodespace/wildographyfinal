import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, keyframes } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import LoginPage from './LoginPage';
import ClippedDrawer from './ClippedDrawer';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const lightPalette = {
  mode: 'light',
  primary: { main: '#2E7D32' },
  secondary: { main: '#E2725B' },
  background: { default: '#F5F0E1', paper: '#FFFFFF' },
  text: { primary: '#424242' },
  transitions: { hover: 'all 0.3s ease', themeChange: 'background-color 0.5s ease, color 0.3s ease' },
};

const darkPalette = {
  mode: 'dark',
  primary: { main: '#66BB6A' },
  secondary: { main: '#FF8A65' },
  background: { default: '#121212', paper: '#1E1E1E' },
  text: { primary: '#E0E0E0' },
  transitions: { hover: 'all 0.3s ease', themeChange: 'background-color 0.5s ease, color 0.3s ease' },
};

const theme = (darkMode) =>
  createTheme({
    palette: darkMode ? darkPalette : lightPalette,
    typography: {
      fontFamily: '"Poppins", sans-serif',
      button: { textTransform: 'none', fontWeight: 'bold' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
            '&:active': { transform: 'scale(0.98)' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)' },
          },
        },
      },
    },
    animations: { fadeIn, float },
  });

const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.3s ease';
  };

  return (
    <ThemeProvider theme={theme(darkMode)}>
      <GlobalStyles styles={{ body: { backgroundColor: darkMode ? '#121212' : '#F5F0E1', transition: 'background-color 0.5s ease' } }} />
      <Routes>
        <Route
          path="/*"
          element={
            !user ? <LoginPage setUser={setUser} /> : <ClippedDrawer user={user} setUser={setUser} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
