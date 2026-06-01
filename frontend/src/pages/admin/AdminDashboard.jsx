import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElections } from '../../store/slices/electionSlice';
import { fetchCandidates } from '../../store/slices/candidateSlice';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PollIcon from '@mui/icons-material/Poll';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BallotIcon from '@mui/icons-material/Ballot';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { elections } = useSelector((state) => state.elections);
  const { candidates } = useSelector((state) => state.candidates);

  useEffect(() => {
    dispatch(fetchElections());
    dispatch(fetchCandidates());
  }, [dispatch]);

  const activeCount = elections.filter((e) => e.status === 'Active').length;
  const draftCount = elections.filter((e) => e.status === 'Draft').length;
  const completedCount = elections.filter((e) => e.status === 'Completed').length;

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        College voting infrastructure orchestrator and security monitor
      </Typography>

      <Grid container spacing={3}>
        {/* Metric 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ p: 1.8, borderRadius: 2, background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                <PollIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {elections.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                  Total Elections
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ p: 1.8, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <BallotIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {activeCount}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                  Active Ballots
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ p: 1.8, borderRadius: 2, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                <HowToRegIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {candidates.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                  Candidates Registered
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ p: 1.8, borderRadius: 2, background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
                <PeopleIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Active
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                  Security Monitor
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        {/* Left Side List */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.25)',
              minHeight: '380px'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#FFFFFF' }}>
              Ballot Infrastructure Overview
            </Typography>

            {elections.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center', color: '#64748B' }}>
                <Typography>No elections set up yet. Go to Manage Elections to create one.</Typography>
              </Box>
            ) : (
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {elections.slice(0, 4).map((elec) => (
                  <ListItem
                    key={elec.id}
                    sx={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 2.5,
                      py: 1.8,
                      px: 2.5
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ background: '#312E81', color: '#818CF8' }}>
                        <BallotIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={elec.title}
                      secondary={`Category: ${elec.position} | Status: ${elec.status}`}
                      primaryTypographyProps={{ fontWeight: 700, color: '#FFFFFF' }}
                      secondaryTypographyProps={{ color: '#64748B', mt: 0.5 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right Side Stats Breakdowns */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.25)',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#FFFFFF' }}>
              Election Lifecycle Breakdown
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flexGrow: 1, justifyContent: 'center' }}>
              {[
                { name: 'Active Elections', val: activeCount, color: '#10B981' },
                { name: 'Completed Elections', val: completedCount, color: '#94A3B8' },
                { name: 'Draft Elections', val: draftCount, color: '#38BDF8' }
              ].map((stat, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: stat.color }} />
                    <Typography sx={{ color: '#94A3B8', fontSize: '0.95rem' }}>{stat.name}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.2rem' }}>
                    {stat.val}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
