import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, MenuItem, Grid, Card, CardContent, CardMedia, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidates } from '../../store/slices/candidateSlice';
import SearchIcon from '@mui/icons-material/Search';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import BallotIcon from '@mui/icons-material/Ballot';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Electrical & Electronics Engineering',
  'Civil Engineering',
  'Information Technology'
];

const POSITIONS = [
  'All Positions',
  'President',
  'Vice President',
  'General Secretary',
  'Treasurer',
  'Sports Secretary'
];

const Candidates = () => {
  const dispatch = useDispatch();
  const { candidates } = useSelector((state) => state.candidates);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedPos, setSelectedPos] = useState('All Positions');
  
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);

  // Trigger search actions upon filter alterations
  useEffect(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedDept !== 'All Departments') filters.department = selectedDept;
    if (selectedPos !== 'All Positions') filters.position = selectedPos;
    
    dispatch(fetchCandidates(filters));
  }, [dispatch, searchTerm, selectedDept, selectedPos]);

  const handleOpenManifesto = (candidate) => {
    setActiveCandidate(candidate);
    setManifestoOpen(true);
  };

  const handleCloseManifesto = () => {
    setManifestoOpen(false);
    setActiveCandidate(null);
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        Candidates Portfolio
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        Audit candidate profiles and review their campaign manifestos
      </Typography>

      {/* Modern Filter Ribbon */}
      <Box
        sx={{
          p: 3,
          mb: 5,
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(30, 41, 59, 0.25)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search Candidate Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#64748B', mr: 1 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F8FAFC',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: '#1E293B',
                      color: '#F8FAFC',
                    }
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F8FAFC',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                }
              }}
            >
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              value={selectedPos}
              onChange={(e) => setSelectedPos(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: '#1E293B',
                      color: '#F8FAFC',
                    }
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F8FAFC',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                }
              }}
            >
              {POSITIONS.map((pos) => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Candidates Grid Card */}
      {candidates.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', color: '#64748B' }}>
          <HowToRegIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography>No matching candidates found in database.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {candidates.map((cand) => (
            <Grid item xs={12} sm={6} md={4} key={cand.id}>
              <Card
                sx={{
                  background: 'rgba(30, 41, 59, 0.45)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  '&:hover': {
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                {cand.profileImage ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={cand.profileImage}
                    alt={cand.candidateName}
                    sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                        fontSize: '2rem',
                        fontWeight: 700
                      }}
                    >
                      {cand.candidateName.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>
                )}
                
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 0.5 }}>
                    {cand.candidateName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#06B6D4', fontWeight: 600, display: 'block', mb: 2 }}>
                    ID: {cand.studentId}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#94A3B8' }}>
                    <BallotIcon sx={{ fontSize: 18, color: '#818CF8' }} />
                    <Typography variant="body2">{cand.position}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: '#94A3B8' }}>
                    <Avatar sx={{ width: 18, height: 18, fontSize: '9px', background: '#334155' }}>D</Avatar>
                    <Typography variant="body2" sx={{ noWrap: true }}>{cand.department}</Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }} />

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOpenManifesto(cand)}
                    sx={{
                      borderColor: 'rgba(6, 182, 212, 0.4)',
                      color: '#06B6D4',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#06B6D4',
                        background: 'rgba(6, 182, 212, 0.05)',
                      }
                    }}
                  >
                    Read Manifesto
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Campaign Manifesto Modal */}
      <Dialog
        open={manifestoOpen}
        onClose={handleCloseManifesto}
        PaperProps={{
          sx: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            maxWidth: '600px',
            width: '100%',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {activeCandidate?.candidateName}'s Manifesto
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#06B6D4', mb: 1, fontWeight: 700 }}>
            Position: {activeCandidate?.position} • Department: {activeCandidate?.department}
          </Typography>
          <Typography variant="body1" sx={{ color: '#E2E8F0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {activeCandidate?.manifesto || 'No manifesto provided by the candidate.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseManifesto}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Close Portfolio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Candidates;
