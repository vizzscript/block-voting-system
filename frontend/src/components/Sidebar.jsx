import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PollIcon from '@mui/icons-material/Poll';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 260;

const Sidebar = ({ open, variant, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin
    ? [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Manage Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Manage Candidates', icon: <HowToRegIcon />, path: '/admin/candidates' },
        { text: 'Manage Elections', icon: <PollIcon />, path: '/admin/elections' },
        { text: 'Blockchain Ledger', icon: <AccountTreeIcon />, path: '/admin/blockchain' },
        { text: 'Election Results', icon: <BarChartIcon />, path: '/admin/results' },
      ]
    : [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
        { text: 'My Profile', icon: <AccountBoxIcon />, path: '/student/profile' },
        { text: 'View Candidates', icon: <HowToRegIcon />, path: '/student/candidates' },
        { text: 'View Elections', icon: <PollIcon />, path: '/student/elections' },
        { text: 'Cast Vote', icon: <HowToVoteIcon />, path: '/student/vote' },
        { text: 'Verify Vote', icon: <VerifiedUserIcon />, path: '/student/verify' },
      ];

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#0B1329',
          color: '#F8FAFC',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', px: 2, py: 3 }}>
        <Box sx={{ px: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isAdmin ? (
            <AdminPanelSettingsIcon sx={{ color: '#818CF8', fontSize: 32 }} />
          ) : (
            <SchoolIcon sx={{ color: '#06B6D4', fontSize: 32 }} />
          )}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
              {isAdmin ? 'Admin Console' : 'Student Portal'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {isAdmin ? 'System Manager' : 'Authorized Voter'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', mb: 2 }} />
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.3,
                    background: isSelected ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)' : 'transparent',
                    border: isSelected ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent',
                    color: isSelected ? '#38BDF8' : '#94A3B8',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#FFFFFF',
                      '& .MuiListItemIcon-root': {
                        color: '#38BDF8',
                      }
                    },
                    '& .MuiListItemIcon-root': {
                      color: isSelected ? '#38BDF8' : '#64748B',
                      minWidth: 40,
                      transition: 'color 0.2s ease',
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      letterSpacing: -0.1
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
