import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { verifyVoteReceipt, clearVerification, clearBlockchainError } from '../../store/slices/blockchainSlice';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';

const VoteVerification = () => {
  const dispatch = useDispatch();
  const { verificationResult, loading, error } = useSelector((state) => state.blockchain);
  const [receiptId, setReceiptId] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const handleVerify = () => {
    if (!receiptId.trim()) return;
    dispatch(clearVerification());
    dispatch(verifyVoteReceipt(receiptId.trim()));
  };

  React.useEffect(() => {
    if (error) {
      setToastOpen(true);
      dispatch(clearBlockchainError());
    }
  }, [error, dispatch]);

  const isVerified = verificationResult?.status === 'Verified';
  const isPending = verificationResult?.status?.includes('Pending');

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        <VerifiedIcon sx={{ mr: 1.5, verticalAlign: 'middle', color: '#06B6D4' }} />
        Verify Your Vote
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        Enter your Vote Receipt ID to verify your ballot on the blockchain
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, maxWidth: 600 }}>
        <TextField
          fullWidth
          placeholder="Enter Receipt ID (e.g., VOTE-A1B2C3)"
          value={receiptId}
          onChange={(e) => setReceiptId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#F8FAFC',
              background: 'rgba(30, 41, 59, 0.45)',
              borderRadius: 3,
              '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover fieldset': { borderColor: '#06B6D4' },
              '&.Mui-focused fieldset': { borderColor: '#4F46E5' }
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleVerify}
          disabled={loading || !receiptId.trim()}
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
            fontWeight: 700, borderRadius: 3, px: 4, textTransform: 'none', minWidth: 130
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : <><SearchIcon sx={{ mr: 0.5 }} /> Verify</>}
        </Button>
      </Box>

      {/* Verification Result */}
      {verificationResult && (
        <Card sx={{
          background: 'rgba(30, 41, 59, 0.45)',
          backdropFilter: 'blur(16px)',
          border: isVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 4,
          boxShadow: isVerified ? '0 0 40px rgba(16, 185, 129, 0.08)' : 'none',
          maxWidth: 700
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              {isVerified ? (
                <VerifiedIcon sx={{ fontSize: 40, color: '#10B981' }} />
              ) : (
                <LinkIcon sx={{ fontSize: 40, color: '#F59E0B' }} />
              )}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {verificationResult.status}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  {isVerified ? 'Your vote has been confirmed on the blockchain' : isPending ? 'Your vote is in the transaction pool awaiting mining' : ''}
                </Typography>
              </Box>
              <Chip
                label={isVerified ? 'On-Chain' : 'Pending'}
                sx={{
                  ml: 'auto',
                  background: isVerified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: isVerified ? '#10B981' : '#F59E0B',
                  fontWeight: 700
                }}
              />
            </Box>

            {/* Detail Grid */}
            <Box sx={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5,
              background: 'rgba(15, 23, 42, 0.5)', borderRadius: 3, p: 3
            }}>
              {verificationResult.block_index !== null && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>BLOCK INDEX</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#06B6D4' }}>
                    #{verificationResult.block_index}
                  </Typography>
                </Box>
              )}
              {verificationResult.nonce !== null && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>NONCE (PoW)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#A5B4FC' }}>
                    {verificationResult.nonce}
                  </Typography>
                </Box>
              )}
              {verificationResult.block_hash && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>BLOCK HASH</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', wordBreak: 'break-all' }}>
                    {verificationResult.block_hash}
                  </Typography>
                </Box>
              )}
              {verificationResult.merkle_root && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>MERKLE ROOT</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', wordBreak: 'break-all' }}>
                    {verificationResult.merkle_root}
                  </Typography>
                </Box>
              )}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>TRANSACTION HASH</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', wordBreak: 'break-all' }}>
                  {verificationResult.transaction_hash}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>TIMESTAMP</Typography>
                <Typography variant="body2" sx={{ color: '#E2E8F0' }}>
                  {verificationResult.timestamp}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Snackbar open={toastOpen} autoHideDuration={5000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error || 'Verification failed. Please check your receipt ID.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoteVerification;
