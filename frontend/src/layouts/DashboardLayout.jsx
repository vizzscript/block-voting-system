import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';

const DashboardLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // If authenticated but profile isn't loaded yet, fetch it
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    // Sync sidebar state with screen size changes
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      <CssBaseline />
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar
        open={sidebarOpen}
        variant={isDesktop ? 'persistent' : 'temporary'}
        onClose={handleToggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 4 },
          width: { md: `calc(100% - ${sidebarOpen ? 260 : 0}px)` },
          marginLeft: { md: sidebarOpen ? '0px' : '-260px' },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          background: 'radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.9) 90%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <Loader open={loading} />
    </Box>
  );
};

export default DashboardLayout;
