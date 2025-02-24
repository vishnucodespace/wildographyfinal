import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './LoginPage';
import ClippedDrawer from './ClippedDrawer';

// ✅ Vibrant Wildlife Theme
const theme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#ff9800' }, // Warm sunset orange
      secondary: { main: '#4caf50' }, // Forest green
      background: { default: darkMode ? '#1a1a1a' : '#f5f5f5', paper: darkMode ? '#333' : '#ffffff' },
      text: { primary: darkMode ? '#ffffff' : '#1c1c1c' },
    },
    typography: {
      fontFamily: '"Poppins", sans-serif', // ✅ More stylish typography
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
  const [currentUser,setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={theme(darkMode)}>
      <Routes>
<Route path="/" element={!user ? <LoginPage setUser={setUser} /> : <ClippedDrawer user={user} setUser={setUser} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
        <Route
          path="/*"
          element={
            user ? (
              <ClippedDrawer user={user} setUser={setUser} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
