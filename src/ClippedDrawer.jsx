import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  CssBaseline, 
  Toolbar, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  styled 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';  // Updated import
import CategoryIcon from '@mui/icons-material/Category';
import NatureIcon from '@mui/icons-material/Nature';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeGrid from './HomeGrid';
import ExplorePage from './ExplorePage';
import ProfilePage from './ProfilePage';
import UploadPostPage from './UploadPostPage';
import SettingsPage from './SettingsPage';
import ConservationPage from './ConservationPage';
import Appbar from './Appbar';
import SearchPeoplePage from './SearchPeoplePage';  // Ensure correct capitalization

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f4f4f4',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#333',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  },
}));

export default function ClippedDrawer({ user, setUser, toggleDarkMode, darkMode }) {
  const [searchItem, setSearchItem] = React.useState('');

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: darkMode ? '#1E1E1E' : '#1976D2',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Appbar
          searchItem={searchItem}
          setsearchItem={setSearchItem}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
      </AppBar>

      <StyledDrawer variant="permanent">
        <Toolbar />
        <Box sx={{ overflowY: 'auto' }}>
          <List>
            {[
              { text: 'Home', icon: <HomeIcon />, path: '/' },
              { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
              { text: 'Upload', icon: <AddAPhotoIcon />, path: '/upload' },
              { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
              { text: 'Search People', icon: <SearchIcon />, path: '/searchpeople' }, // Fixed icon
              { text: 'Messages', icon: <MailIcon />, path: '/messages' },
            ].map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 0.3s',
                    '&:hover': { backgroundColor: darkMode ? '#333' : '#ddd', transform: 'scale(1.05)' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ backgroundColor: darkMode ? '#555' : '#ccc' }} />
          <List>
            {[
              { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
              { text: 'Conservation', icon: <NatureIcon />, path: '/conservation' },
            ].map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 0.3s',
                    '&:hover': { backgroundColor: darkMode ? '#333' : '#ddd', transform: 'scale(1.05)' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ backgroundColor: darkMode ? '#555' : '#ccc' }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/settings"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.3s',
                  '&:hover': { backgroundColor: darkMode ? '#333' : '#ddd', transform: 'scale(1.05)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ backgroundColor: darkMode ? '#555' : '#ccc' }} />
        </Box>
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: `${drawerWidth}px`,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        <Routes>
          <Route path="/" element={<HomeGrid searchItem={searchItem} currentUser={user} />} />
          <Route path="/explore" element={<ExplorePage currentUser={user} />} />
          <Route path="/upload" element={<UploadPostPage />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
          <Route path="/searchpeople" element={<SearchPeoplePage />} />
          <Route path="/messages" element={<div style={{ padding: '20px' }}><h2>Messages Page</h2></div>} />
          <Route path="/conservation" element={<ConservationPage />} />
          <Route path="/settings" element={<SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </Box>
    </Box>
  );
}
