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
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import NatureIcon from '@mui/icons-material/Nature';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeGrid from './HomeGrid';
import ExplorePage from './ExplorePage';
import ProfilePage from './ProfilePage';
import UploadPostPage from './UploadPostPage';
import SettingsPage from './SettingsPage';
import ConservationPage from './ConservationPage';
import Appbar from './Appbar';
import SearchPeoplePage from './SearchPeoplePage';
import ViewProfile from './ViewProfile';
import Notifications from './Notifications';
import FollowRequests from './FollowRequests';

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: 'background.paper',
    color: 'text.primary',
    borderRight: (theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
}));

// Animation variants for list items
const itemVariants = {
  rest: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    x: 8, // Slight shift right for floating effect
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function ClippedDrawer({ user, setUser, toggleDarkMode, darkMode }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <Appbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <StyledDrawer variant="permanent">
        <Toolbar />
        <Box sx={{ overflowY: 'auto', py: 1 }}>
          <List>
            {[
              { text: 'Home', icon: <HomeIcon />, path: '/' },
              { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
              { text: 'Upload', icon: <AddAPhotoIcon />, path: '/upload' },
              { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
              { text: 'Search People', icon: <SearchIcon />, path: '/searchpeople' },
              { text: 'Notifications', icon: <MailIcon />, path: '/notifications' },
            ].map(({ text, icon, path }) => (
              <motion.div
                key={text}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to={path}
                    sx={{
                      py: 1.5,
                      px: 3,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'text.secondary', minWidth: 48 }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
          <Divider sx={{ my: 1, bgcolor: 'divider' }} />
          <List>
            {[
              { text: 'Follow Requests', icon: <PersonAddIcon />, path: '/follow-requests' },
              { text: 'Conservation', icon: <NatureIcon />, path: '/conservation' },
            ].map(({ text, icon, path }) => (
              <motion.div
                key={text}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to={path}
                    sx={{
                      py: 1.5,
                      px: 3,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'text.secondary', minWidth: 48 }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
          <Divider sx={{ my: 1, bgcolor: 'divider' }} />
          <List>
            <motion.div
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/settings"
                  sx={{
                    py: 1.5,
                    px: 3,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ color: 'text.secondary', minWidth: 48 }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          </List>
          <Divider sx={{ my: 1, bgcolor: 'divider' }} />
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
          bgcolor: 'background.default',
        }}
      >
        <Routes>
          <Route path="/" element={<HomeGrid currentUser={user} />} />
          <Route path="/explore" element={<ExplorePage currentUser={user} />} />
          <Route path="/upload" element={<UploadPostPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
          <Route path="/searchpeople" element={<SearchPeoplePage />} />
          <Route path="/notifications" element={<Notifications currentUser={user} />} />
          <Route path="/conservation" element={<ConservationPage darkMode={darkMode} />} />
          <Route path="/settings" element={<SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} currentUser={user} />} />
          <Route path="/viewprofile/:userId" element={<ViewProfile />} />
          <Route path="/follow-requests" element={<FollowRequests currentUser={user} />} />
        </Routes>
      </Box>
    </Box>
  );
}