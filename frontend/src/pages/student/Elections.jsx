import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElections } from '../../store/slices/electionSlice';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const Elections = () => {
  const dispatch = useDispatch();
  const { elections } = useSelector((state) => state.elections);

  useEffect(() => {
    dispatch(fetchElections());
  }, [dispatch]);

  // Students must never view Draft elections
  const visibleElections = elections.filter((e) => e.status !== 'Draft');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)' };
      case 'Scheduled':
        return { bg: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)' };
      case 'Completed':
        return { bg: 'rgba(148, 163, 184, 0.12)', color: '#94A3B8', border: '1px solid rgba(148, 163, 184, 0.25)' };
      case 'Cancelled':
        return { bg: 'rgba(244, 63, 94, 0.12)', color: '#F43F5E', border: '1px solid rgba(244, 63, 94, 0.25)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.08)' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    // Replace ISO-Z formatting for clean cross-browser parsing
    const cleaned = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
    return new Date(cleaned).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        Elections Registry
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        Check active, scheduled, and completed student senate ballots
      </Typography>

      {visibleElections.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', color: '#64748B' }}>
          <HourglassEmptyIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography>No active or scheduled elections are running at this moment.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {visibleElections.map((elec) => {
            const styles = getStatusStyle(elec.status);
            return (
              <Grid item xs={12} md={6} key={elec.id}>
                <Card
                  sx={{
                    background: 'rgba(30, 41, 59, 0.45)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 4,
                    boxShadow: 'none',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      borderColor: 'rgba(6, 182, 212, 0.3)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
                          {elec.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#06B6D4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Category: {elec.position}
                        </Typography>
                      </Box>
                      <Chip
                        label={elec.status}
                        sx={{
                          background: styles.bg,
                          color: styles.color,
                          border: styles.border,
                          fontWeight: 700,
                          borderRadius: 1.5,
                          fontSize: '0.8rem'
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 4, lineHeight: 1.6 }}>
                      {elec.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, borderTop: '1px solid rgba(255,255,255,0.05)', pt: 3.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarTodayIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontWeight: 600 }}>
                            STARTS AT
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                            {formatDate(elec.startDate)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EventIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontWeight: 600 }}>
                            ENDS AT
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                            {formatDate(elec.endDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Elections;
