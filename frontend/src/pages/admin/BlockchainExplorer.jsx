import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Collapse, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlockchain, validateBlockchain, clearBlockchainError } from '../../store/slices/blockchainSlice';
import LinkIcon from '@mui/icons-material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VerifiedIcon from '@mui/icons-material/Verified';
import DangerousIcon from '@mui/icons-material/Dangerous';
import TagIcon from '@mui/icons-material/Tag';

const BlockchainExplorer = () => {
  const dispatch = useDispatch();
  const { chain, validationStatus, loading, error } = useSelector((state) => state.blockchain);
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBlockchain());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToastOpen(true);
      dispatch(clearBlockchainError());
    }
  }, [error, dispatch]);

  const handleValidate = () => {
    dispatch(validateBlockchain());
  };

  const toggleBlock = (index) => {
    setExpandedBlock(expandedBlock === index ? null : index);
  };

  const hashPreview = (h) => h ? `${h.slice(0, 12)}...${h.slice(-8)}` : 'N/A';

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            <LinkIcon sx={{ mr: 1.5, verticalAlign: 'middle', color: '#06B6D4' }} />
            Blockchain Explorer
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8' }}>
            Inspect mined blocks, transactions, and cryptographic hashes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {validationStatus && (
            <Chip
              icon={validationStatus.is_valid ? <VerifiedIcon /> : <DangerousIcon />}
              label={validationStatus.is_valid ? 'Chain Valid' : 'Chain Corrupted!'}
              sx={{
                background: validationStatus.is_valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                color: validationStatus.is_valid ? '#10B981' : '#F43F5E',
                fontWeight: 700, fontSize: '0.85rem',
                border: validationStatus.is_valid ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)',
                '& .MuiChip-icon': { color: 'inherit' }
              }}
            />
          )}
          <Button
            onClick={handleValidate}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 3
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Validate Chain'}
          </Button>
        </Box>
      </Box>

      {/* Chain Summary */}
      {chain && (
        <Box sx={{
          display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap'
        }}>
          {[
            { label: 'Chain Length', value: chain.chain_length, color: '#06B6D4' },
            { label: 'Difficulty', value: chain.difficulty, color: '#A5B4FC' },
            { label: 'Pending Transactions', value: chain.pending_pool?.length || 0, color: '#F59E0B' },
          ].map((stat) => (
            <Card key={stat.label} sx={{
              background: 'rgba(30, 41, 59, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3, flex: 1, minWidth: 180
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Block List */}
      {chain?.chain?.slice().reverse().map((block) => (
        <Card key={block.index} sx={{
          background: 'rgba(30, 41, 59, 0.45)',
          backdropFilter: 'blur(16px)',
          border: expandedBlock === block.index ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3, mb: 2,
          transition: 'all 0.2s ease-in-out'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => toggleBlock(block.index)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: block.index === 0 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                  fontWeight: 900, fontSize: '1.1rem'
                }}>
                  #{block.index}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {block.index === 0 ? 'Genesis Block' : `Block #${block.index}`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                    {hashPreview(block.hash)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label={`${block.transactions?.length || 0} Tx`} size="small" sx={{
                  background: 'rgba(79, 70, 229, 0.12)', color: '#A5B4FC', fontWeight: 700
                }} />
                <Chip label={`Nonce: ${block.nonce}`} size="small" sx={{
                  background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', fontWeight: 700
                }} />
                <IconButton sx={{ color: '#64748B' }}>
                  {expandedBlock === block.index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedBlock === block.index}>
              <Box sx={{ mt: 3, p: 2.5, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>TIMESTAMP</Typography>
                    <Typography variant="body2" sx={{ color: '#E2E8F0' }}>{block.timestamp}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>NONCE</Typography>
                    <Typography variant="body2" sx={{ color: '#06B6D4', fontWeight: 700 }}>{block.nonce}</Typography>
                  </Box>
                </Box>
                {[
                  { label: 'BLOCK HASH', value: block.hash },
                  { label: 'PREVIOUS HASH', value: block.previous_hash },
                  { label: 'MERKLE ROOT', value: block.merkle_root }
                ].map((item) => (
                  <Box key={item.label} sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{item.label}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}

                {/* Transactions */}
                {block.transactions?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#E2E8F0' }}>
                      <TagIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Transactions ({block.transactions.length})
                    </Typography>
                    {block.transactions.map((tx, i) => (
                      <Box key={i} sx={{
                        p: 2, mb: 1, background: 'rgba(30, 41, 59, 0.4)', borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>TX ID</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#A5B4FC', fontSize: '0.75rem' }}>
                              {tx.transaction_id}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>ELECTION</Typography>
                            <Typography variant="body2" sx={{ color: '#06B6D4', fontWeight: 700 }}>#{tx.election_id}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>CANDIDATE</Typography>
                            <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>#{tx.candidate_id}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>VOTER HASH</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', fontSize: '0.72rem', wordBreak: 'break-all' }}>
                            {tx.voter_hash}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      <Snackbar open={toastOpen} autoHideDuration={5000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity="error" variant="filled">{error || 'An error occurred.'}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BlockchainExplorer;
