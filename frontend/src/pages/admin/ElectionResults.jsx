import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, MenuItem, TextField, Chip, Avatar, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElections } from '../../store/slices/electionSlice';
import { fetchElectionResults, fetchElectionStatistics, fetchElectionWinner } from '../../store/slices/blockchainSlice';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CHART_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#14B8A6'];

const ElectionResults = () => {
  const dispatch = useDispatch();
  const { elections } = useSelector((state) => state.elections);
  const { electionResults, electionStatistics, electionWinner, loading } = useSelector((state) => state.blockchain);
  const [selectedElectionId, setSelectedElectionId] = useState('');

  useEffect(() => {
    dispatch(fetchElections());
  }, [dispatch]);

  useEffect(() => {
    if (selectedElectionId) {
      dispatch(fetchElectionResults(selectedElectionId));
      dispatch(fetchElectionStatistics(selectedElectionId));
      dispatch(fetchElectionWinner(selectedElectionId));
    }
  }, [selectedElectionId, dispatch]);

  const closedOrActive = elections.filter((e) => e.status === 'Active' || e.status === 'Completed');

  const barData = electionResults ? {
    labels: electionResults.results.map((c) => c.candidate_name),
    datasets: [{
      label: 'Votes',
      data: electionResults.results.map((c) => c.votes),
      backgroundColor: CHART_COLORS.slice(0, electionResults.results.length),
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null;

  const pieData = electionResults ? {
    labels: electionResults.results.map((c) => c.candidate_name),
    datasets: [{
      data: electionResults.results.map((c) => c.votes),
      backgroundColor: CHART_COLORS.slice(0, electionResults.results.length),
      borderWidth: 0,
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94A3B8', font: { family: 'Outfit', weight: 600 } } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#F8FAFC', bodyColor: '#94A3B8' }
    },
    scales: {
      x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.03)' } },
      y: { ticks: { color: '#64748B', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.03)' } }
    }
  };

  const glassCard = {
    background: 'rgba(30, 41, 59, 0.45)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    boxShadow: 'none'
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        <BarChartIcon sx={{ mr: 1.5, verticalAlign: 'middle', color: '#06B6D4' }} />
        Election Results Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        View blockchain-verified vote tallies and turnout statistics
      </Typography>

      {/* Election Selector */}
      <TextField
        select
        label="Select Election"
        value={selectedElectionId}
        onChange={(e) => setSelectedElectionId(e.target.value)}
        sx={{
          minWidth: 350, mb: 4,
          '& .MuiOutlinedInput-root': {
            color: '#F8FAFC',
            background: 'rgba(30, 41, 59, 0.45)',
            borderRadius: 3,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: '#06B6D4' },
            '&.Mui-focused fieldset': { borderColor: '#4F46E5' }
          },
          '& .MuiInputLabel-root': { color: '#64748B' },
          '& .MuiSelect-icon': { color: '#64748B' }
        }}
      >
        {closedOrActive.map((e) => (
          <MenuItem key={e.id} value={e.id}>{e.title} — {e.position} ({e.status})</MenuItem>
        ))}
      </TextField>

      {loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#06B6D4' }} />
        </Box>
      )}

      {selectedElectionId && electionResults && !loading && (
        <>
          {/* Stats Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { icon: <PeopleIcon />, label: 'Registered Voters', value: electionStatistics?.registered_students, color: '#4F46E5' },
              { icon: <HowToVoteIcon />, label: 'Votes Cast', value: electionStatistics?.votes_cast, color: '#06B6D4' },
              { icon: <BarChartIcon />, label: 'Turnout', value: electionStatistics?.turnout_percentage, color: '#10B981' },
            ].map((stat) => (
              <Grid item xs={12} sm={4} key={stat.label}>
                <Card sx={glassCard}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ color: stat.color, mb: 1 }}>{React.cloneElement(stat.icon, { sx: { fontSize: 36 } })}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color }}>{stat.value ?? '—'}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Winner Card */}
          {electionWinner && electionWinner.total_votes > 0 && (
            <Card sx={{
              ...glassCard,
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(30, 41, 59, 0.45))',
              mb: 4
            }}>
              <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <EmojiEventsIcon sx={{ fontSize: 56, color: '#F59E0B' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Winner
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{electionWinner.winner}</Typography>
                  <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                    Total Votes: <strong style={{ color: '#06B6D4' }}>{electionWinner.total_votes}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={glassCard}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Vote Distribution (Bar Chart)</Typography>
                  {barData && <Bar data={barData} options={chartOptions} />}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={glassCard}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Vote Share (Pie Chart)</Typography>
                  {pieData && <Pie data={pieData} options={{ responsive: true, plugins: { legend: { labels: { color: '#94A3B8', font: { family: 'Outfit' } } } } }} />}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Candidate Breakdown Table */}
          <Card sx={{ ...glassCard, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Candidate-Wise Breakdown</Typography>
              {electionResults.results.map((c, i) => (
                <Box key={c.candidate_id} sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 1,
                  background: 'rgba(15, 23, 42, 0.4)', borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <Avatar src={c.profile_image} sx={{
                    width: 44, height: 44,
                    background: `linear-gradient(135deg, ${CHART_COLORS[i % CHART_COLORS.length]}, #06B6D4)`
                  }}>{c.candidate_name?.[0]}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.candidate_name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>{c.department}</Typography>
                  </Box>
                  <Chip label={`${c.votes} votes`} sx={{
                    background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', fontWeight: 700
                  }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default ElectionResults;
