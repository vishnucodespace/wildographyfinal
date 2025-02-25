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
  styled,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import NatureIcon from '@mui/icons-material/Nature';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon for Follow Requests
import HomeGrid from './HomeGrid';
import ExplorePage from './ExplorePage';
import ProfilePage from './ProfilePage';
import UploadPostPage from './UploadPostPage';
import SettingsPage from './SettingsPage';
import ConservationPage from './ConservationPage';
import Appbar from './Appbar';
import SearchPeoplePage from './SearchPeoplepage';
import ViewProfile from './ViewProfile';
import Notifications from './Notifications';
import FollowRequests from './FollowRequests';

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function ClippedDrawer({ user, setUser, toggleDarkMode, darkMode }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <Appbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <StyledDrawer variant="permanent">
        <Toolbar />
        <Box sx={{ overflowY: 'auto' }}>
          <List>
            {[
              { text: 'Home', icon: <HomeIcon />, path: '/' },
              { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
              { text: 'Upload', icon: <AddAPhotoIcon />, path: '/upload' },
              { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
              { text: 'Search People', icon: <SearchIcon />, path: '/searchpeople' },
              { text: 'Notifications', icon: <MailIcon />, path: '/notifications' },
            ].map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          {/* Replacing Categories with Follow Requests */}
          <List>
            {[
              { text: 'Follow Requests', icon: <PersonAddIcon />, path: '/follow-requests' },
              { text: 'Conservation', icon: <NatureIcon />, path: '/conservation' },
            ].map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/settings"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
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
          <Route path="/" element={<HomeGrid currentUser={user} />} />
          <Route path="/explore" element={<ExplorePage currentUser={user} />} />
          <Route path="/upload" element={<UploadPostPage />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
          <Route path="/searchpeople" element={<SearchPeoplePage />} />
          <Route path="/notifications" element={<Notifications currentUser={user} />} />
          <Route path="/conservation" element={<ConservationPage />} />
          <Route path="/settings" element={<SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          {/* Restore the ViewProfile route so users can see others' profiles */}
          <Route path="/viewprofile/:userId" element={<ViewProfile />} />
          <Route path="/follow-requests" element={<FollowRequests currentUser={user} />} />
        </Routes>
      </Box>
    </Box>
  );
}
