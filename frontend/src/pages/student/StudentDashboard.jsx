import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElections } from '../../store/slices/electionSlice';
import { fetchCandidates } from '../../store/slices/candidateSlice';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PollIcon from '@mui/icons-material/Poll';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { elections } = useSelector((state) => state.elections);
  const { candidates } = useSelector((state) => state.candidates);

  useEffect(() => {
    dispatch(fetchElections());
    dispatch(fetchCandidates());
  }, [dispatch]);

  const activeElectionsCount = elections.filter((e) => e.status === 'Active').length;

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        Welcome, {user?.fullName || 'Student'}!
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        Academic Year: {user?.year || 'N/A'} • Department: {user?.department || 'N/A'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#06B6D4'
                }}
              >
                <PollIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {activeElectionsCount}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Active Elections
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(129, 140, 248, 0.1)',
                  color: '#818CF8'
                }}
              >
                <HowToRegIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {candidates.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Total Candidates
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981'
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  100%
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Account Verified
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ fontWeight: 700, mt: 6, mb: 3, color: '#FFFFFF' }}>
        Quick Operations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.25)',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#FFFFFF' }}>
              Browse Nominees
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
              View manifestos and portfolios of candidates running in various categories.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/student/candidates')}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Audit Candidates
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.25)',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#FFFFFF' }}>
              Ballot Stations
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
              View active and upcoming elections, and check operational dates.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/student/elections')}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Check Elections
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
