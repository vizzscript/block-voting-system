import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/profile');
    }
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: -0.5,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          SECUREVOTE
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', display: { xs: 'none', sm: 'block' } }}>
            {user?.fullName || 'User'}
          </Typography>
          <Tooltip title="Profile settings">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)'
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#F8FAFC',
                borderRadius: 2,
                mt: 1.5,
                minWidth: 160,
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                '& .MuiMenuItem-root': {
                  gap: 1.5,
                  py: 1.2,
                  fontSize: '0.9rem',
                  borderRadius: 1,
                  mx: 0.5,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileClick}>
              <AccountCircleIcon fontSize="small" sx={{ color: '#06B6D4' }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <LogoutIcon fontSize="small" sx={{ color: '#F43F5E' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
