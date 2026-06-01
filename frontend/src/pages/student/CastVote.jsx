import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElections } from '../../store/slices/electionSlice';
import { fetchCandidates } from '../../store/slices/candidateSlice';
import { castVote, clearBlockchainError, resetBlockchainSuccess, clearVoteReceipt } from '../../store/slices/blockchainSlice';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CastVote = () => {
  const dispatch = useDispatch();
  const { elections } = useSelector((state) => state.elections);
  const { candidates } = useSelector((state) => state.candidates);
  const { voteReceipt, loading, error, success } = useSelector((state) => state.blockchain);

  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchElections());
    dispatch(fetchCandidates());
  }, [dispatch]);

  useEffect(() => {
    if (success && voteReceipt) {
      setConfirmOpen(false);
      setPassword('');
      setReceiptDialogOpen(true);
      dispatch(resetBlockchainSuccess());
    }
  }, [success, voteReceipt, dispatch]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity('error');
      setToastOpen(true);
      dispatch(clearBlockchainError());
    }
  }, [error, dispatch]);

  const activeElections = elections.filter((e) => e.status === 'Active');

  const filteredCandidates = selectedElection
    ? candidates.filter((c) => c.position === selectedElection.position)
    : [];

  const handleVoteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmOpen(true);
  };

  const handleConfirmVote = () => {
    if (!password) {
      setToastMessage('Please enter your password to sign the vote.');
      setToastSeverity('warning');
      setToastOpen(true);
      return;
    }
    dispatch(castVote({
      election_id: selectedElection.id,
      candidate_id: selectedCandidate.id,
      password
    }));
  };

  const handleCopyReceipt = () => {
    if (voteReceipt) {
      navigator.clipboard.writeText(voteReceipt.receipt_id);
      setToastMessage('Receipt ID copied to clipboard!');
      setToastSeverity('info');
      setToastOpen(true);
    }
  };

  const glassCard = {
    background: 'rgba(30, 41, 59, 0.45)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    boxShadow: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease-in-out',
    '&:hover': {
      borderColor: 'rgba(6, 182, 212, 0.3)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
      transform: 'translateY(-2px)'
    }
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        <HowToVoteIcon sx={{ mr: 1.5, verticalAlign: 'middle', color: '#06B6D4' }} />
        Cast Your Vote
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        Select an active election and vote for your preferred candidate
      </Typography>

      {/* Step 1: Election Selection */}
      {!selectedElection ? (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#E2E8F0' }}>
            Step 1: Select an Active Election
          </Typography>
          {activeElections.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', color: '#64748B' }}>
              <HowToVoteIcon sx={{ fontSize: 64, mb: 1 }} />
              <Typography>No active elections are available for voting right now.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {activeElections.map((elec) => (
                <Grid item xs={12} md={6} key={elec.id}>
                  <Card sx={glassCard} onClick={() => setSelectedElection(elec)}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                          {elec.title}
                        </Typography>
                        <Chip label="Active" sx={{
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          fontWeight: 700
                        }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#06B6D4', fontWeight: 700, textTransform: 'uppercase' }}>
                        Position: {elec.position}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1.5 }}>
                        {elec.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <>
          {/* Step 2: Candidate Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => { setSelectedElection(null); setSelectedCandidate(null); }}
              sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94A3B8', '&:hover': { borderColor: '#06B6D4' } }}
            >
              ← Back to Elections
            </Button>
            <Chip label={selectedElection.title} sx={{
              background: 'rgba(79, 70, 229, 0.15)',
              color: '#A5B4FC',
              fontWeight: 700
            }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#E2E8F0' }}>
            Step 2: Choose Your Candidate for "{selectedElection.position}"
          </Typography>

          {filteredCandidates.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', color: '#64748B' }}>
              <Typography>No candidates have been nominated for this position yet.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCandidates.map((c) => (
                <Grid item xs={12} sm={6} md={4} key={c.id}>
                  <Card sx={{
                    ...glassCard,
                    border: selectedCandidate?.id === c.id
                      ? '2px solid #06B6D4'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <CardContent sx={{ p: 3.5, textAlign: 'center' }}>
                      <Avatar
                        src={c.profile_image}
                        sx={{
                          width: 80, height: 80, mx: 'auto', mb: 2,
                          border: '3px solid rgba(6, 182, 212, 0.3)',
                          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)'
                        }}
                      >
                        {c.candidate_name?.[0]}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5 }}>
                        {c.candidate_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#06B6D4', fontWeight: 600, display: 'block', mb: 1 }}>
                        {c.department}
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: '#94A3B8', mb: 2.5, fontSize: '0.8rem',
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>
                        {c.manifesto}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleVoteClick(c)}
                        sx={{
                          background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                          fontWeight: 700,
                          borderRadius: 2,
                          textTransform: 'none',
                          py: 1.2,
                          '&:hover': { boxShadow: '0 0 24px rgba(79, 70, 229, 0.4)' }
                        }}
                      >
                        <HowToVoteIcon sx={{ mr: 1 }} /> Vote for {c.candidate_name?.split(' ')[0]}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPassword(''); }}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            color: '#F8FAFC',
            minWidth: 450
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          <LockIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#F59E0B' }} />
          Confirm Your Vote
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
            You are about to cast your vote for <strong style={{ color: '#06B6D4' }}>{selectedCandidate?.candidate_name}</strong> in
            the <strong style={{ color: '#A5B4FC' }}>{selectedElection?.title}</strong> election.
            This action is <strong style={{ color: '#F43F5E' }}>irreversible</strong>. Enter your password to digitally sign your ballot.
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Enter Your Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F8FAFC',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                '&:hover fieldset': { borderColor: '#06B6D4' },
                '&.Mui-focused fieldset': { borderColor: '#4F46E5' }
              },
              '& .MuiInputLabel-root': { color: '#64748B' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setConfirmOpen(false); setPassword(''); }} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmVote}
            disabled={loading}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              textTransform: 'none'
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign & Cast Vote'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vote Receipt Dialog */}
      <Dialog
        open={receiptDialogOpen}
        onClose={() => { setReceiptDialogOpen(false); dispatch(clearVoteReceipt()); setSelectedElection(null); setSelectedCandidate(null); }}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 4,
            color: '#F8FAFC',
            minWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: '#10B981', display: 'block', mx: 'auto', mb: 1 }} />
          Vote Cast Successfully!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
            Your vote has been digitally signed and submitted to the blockchain transaction pool.
          </Typography>
          {voteReceipt && (
            <Box sx={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3, p: 3, textAlign: 'left'
            }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>RECEIPT ID</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#06B6D4', fontFamily: 'monospace' }}>
                  {voteReceipt.receipt_id}
                </Typography>
                <Button size="small" onClick={handleCopyReceipt} sx={{ minWidth: 'auto', color: '#64748B' }}>
                  <ContentCopyIcon fontSize="small" />
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>TRANSACTION HASH</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', wordBreak: 'break-all', mb: 2 }}>
                {voteReceipt.transaction_hash}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>TIMESTAMP</Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                {voteReceipt.timestamp}
              </Typography>
            </Box>
          )}
          <Typography variant="caption" sx={{ color: '#F59E0B', mt: 2, display: 'block' }}>
            ⚠️ Save your Receipt ID! You will need it to verify your vote later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => { setReceiptDialogOpen(false); dispatch(clearVoteReceipt()); setSelectedElection(null); setSelectedCandidate(null); }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              fontWeight: 700, borderRadius: 2, px: 5, textTransform: 'none'
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar open={toastOpen} autoHideDuration={5000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} variant="filled" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CastVote;
