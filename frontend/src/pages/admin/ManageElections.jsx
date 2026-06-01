import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, Snackbar, Alert, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElections, createElection, updateElection, deleteElection, activateElection, closeElection, fetchElectionStats, resetElectionSuccess, clearElectionError } from '../../store/slices/electionSlice';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BlockIcon from '@mui/icons-material/Block';
import BarChartIcon from '@mui/icons-material/BarChart';
import PollIcon from '@mui/icons-material/Poll';
import Loader from '../../components/Loader';

const POSITIONS = [
  'President',
  'Vice President',
  'General Secretary',
  'Treasurer',
  'Sports Secretary'
];

const ManageElections = () => {
  const dispatch = useDispatch();
  
  const { elections, statistics, loading, error, success } = useSelector((state) => state.elections);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  
  const [statsOpen, setStatsOpen] = useState(false);
  const [activeElectionForStats, setActiveElectionForStats] = useState(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  
  const startDateVal = watch('startDate');

  useEffect(() => {
    dispatch(fetchElections());
  }, [dispatch]);

  // Handle operation outcomes (success or error notifications)
  useEffect(() => {
    if (success) {
      setToastMessage(editingElection ? 'Election updated successfully!' : 'Election created successfully!');
      setToastSeverity('success');
      setToastOpen(true);
      setDialogOpen(false);
      dispatch(resetElectionSuccess());
    }
  }, [success, editingElection, dispatch]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity('error');
      setToastOpen(true);
      dispatch(clearElectionError());
    }
  }, [error, dispatch]);

  const handleOpenAdd = () => {
    setEditingElection(null);
    reset({
      title: '',
      description: '',
      position: '',
      startDate: '',
      endDate: '',
      status: 'Draft'
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (elec) => {
    setEditingElection(elec);
    
    // Parse ISO dates back to HTML datetime-local format
    const startParsed = elec.startDate ? elec.startDate.substring(0, 16) : '';
    const endParsed = elec.endDate ? elec.endDate.substring(0, 16) : '';
    
    reset({
      title: elec.title,
      description: elec.description,
      position: elec.position,
      startDate: startParsed,
      endDate: endParsed,
      status: elec.status
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (elec) => {
    setElectionToDelete(elec);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDelete = () => {
    setElectionToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleOpenStats = (elec) => {
    setActiveElectionForStats(elec);
    dispatch(fetchElectionStats(elec.id));
    setStatsOpen(true);
  };

  const handleCloseStats = () => {
    setStatsOpen(false);
    setActiveElectionForStats(null);
  };

  const onSubmit = (data) => {
    // Append standard 'Z' Zulu tags for standardized backend Pydantic validations
    const electionData = {
      ...data,
      startDate: data.startDate.includes('Z') ? data.startDate : `${data.startDate}:00Z`,
      endDate: data.endDate.includes('Z') ? data.endDate : `${data.endDate}:00Z`,
    };

    if (editingElection) {
      dispatch(updateElection({ id: editingElection.id, electionData }));
    } else {
      dispatch(createElection(electionData));
    }
  };

  const handleConfirmDelete = async () => {
    if (electionToDelete) {
      try {
        await dispatch(deleteElection(electionToDelete.id)).unwrap();
        setToastMessage('Election deleted successfully!');
        setToastSeverity('success');
        setToastOpen(true);
      } catch (err) {
        setToastMessage(err || 'Failed to delete election.');
        setToastSeverity('error');
        setToastOpen(true);
      } finally {
        handleCloseDelete();
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await dispatch(activateElection(id)).unwrap();
      setToastMessage('Election activated and live for voting!');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      setToastMessage(err || 'Failed to activate election.');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleCloseElection = async (id) => {
    try {
      await dispatch(closeElection(id)).unwrap();
      setToastMessage('Election closed successfully.');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      setToastMessage(err || 'Failed to close election.');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)' };
      case 'Scheduled':
        return { bg: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)' };
      case 'Completed':
        return { bg: 'rgba(148, 163, 184, 0.12)', color: '#94A3B8', border: '1px solid rgba(148, 163, 184, 0.25)' };
      case 'Draft':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.25)' };
      case 'Cancelled':
        return { bg: 'rgba(244, 63, 94, 0.12)', color: '#F43F5E', border: '1px solid rgba(244, 63, 94, 0.25)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', border: 'none' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const cleaned = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
    return new Date(cleaned).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
            Manage Elections
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8' }}>
            Schedule elections, alter lifecycles, and audit statistical turnouts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            fontWeight: 700,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            borderRadius: 2.5,
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
          }}
        >
          Create Ballot
        </Button>
      </Box>

      {/* Elections Datatable */}
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(30, 41, 59, 0.25)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          boxShadow: 'none',
          overflow: 'hidden',
          '& .MuiTableCell-root': {
            borderColor: 'rgba(255, 255, 255, 0.05)',
            color: '#E2E8F0',
            py: 2.2
          }
        }}
      >
        <Table>
          <TableHead sx={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Election Ballot</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Starts At</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Ends At</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }} align="right">Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#64748B', py: 8 }}>
                  <PollIcon sx={{ fontSize: 48, mb: 1, color: '#475569' }} />
                  <Typography>No election ballots created in system yet.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              elections.map((elec) => {
                const styles = getStatusStyle(elec.status);
                return (
                  <TableRow
                    key={elec.id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.02)',
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>{elec.title}</TableCell>
                    <TableCell>{elec.position}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{formatDate(elec.startDate)}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{formatDate(elec.endDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={elec.status}
                        size="small"
                        sx={{
                          background: styles.bg,
                          color: styles.color,
                          border: styles.border,
                          fontWeight: 700,
                          borderRadius: 1
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {elec.status === 'Draft' && (
                        <IconButton
                          title="Activate Election"
                          onClick={() => handleActivate(elec.id)}
                          sx={{ color: '#10B981', mr: 0.5 }}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      )}
                      {elec.status === 'Active' && (
                        <IconButton
                          title="Close Election"
                          onClick={() => handleCloseElection(elec.id)}
                          sx={{ color: '#F43F5E', mr: 0.5 }}
                        >
                          <BlockIcon />
                        </IconButton>
                      )}
                      <IconButton
                        title="Analytical Stats"
                        onClick={() => handleOpenStats(elec)}
                        sx={{ color: '#818CF8', mr: 0.5 }}
                      >
                        <BarChartIcon />
                      </IconButton>
                      <IconButton
                        title="Edit Details"
                        onClick={() => handleOpenEdit(elec)}
                        sx={{ color: '#38BDF8', mr: 0.5 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        title="Delete Ballot"
                        onClick={() => handleOpenDelete(elec)}
                        sx={{ color: '#F43F5E' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3.5,
            maxWidth: '650px',
            width: '100%',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 3 }}>
          {editingElection ? 'Modify Election Settings' : 'Create New Ballot'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Election Title"
                  variant="outlined"
                  {...register('title', { required: 'Election title is required' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#F8FAFC',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06B6D4' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category Position"
                  variant="outlined"
                  defaultValue=""
                  {...register('position', { required: 'Running category is required' })}
                  error={!!errors.position}
                  helperText={errors.position?.message}
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
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06B6D4' },
                  }}
                >
                  {POSITIONS.map((pos) => (
                    <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Initial status"
                  variant="outlined"
                  defaultValue="Draft"
                  {...register('status', { required: 'Initial status is required' })}
                  error={!!errors.status}
                  helperText={errors.status?.message}
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
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06B6D4' },
                  }}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  {...register('startDate', { required: 'Start date is required' })}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#F8FAFC',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06B6D4' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="End Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  {...register('endDate', {
                    required: 'End date is required',
                    validate: (val) => new Date(val) > new Date(startDateVal) || 'End date must be chronologically after start date'
                  })}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#F8FAFC',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06B6D4' },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Ballot Description"
                  variant="outlined"
                  {...register('description', { required: 'Ballot description is required' })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#F8FAFC',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#06B6D4' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06B6D4' },
                  }}
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ pt: 4, pb: 1, gap: 1 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                sx={{ color: '#94A3B8', fontWeight: 600, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 4
                }}
              >
                {editingElection ? 'Save Changes' : 'Create Ballot'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDelete}
        PaperProps={{
          sx: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            maxWidth: '450px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94A3B8' }}>
            Are you absolutely sure you want to delete ballot <strong>{electionToDelete?.title}</strong>? This action is non-reversible and will delete all parameters.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseDelete} sx={{ color: '#94A3B8', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{ background: '#F43F5E', color: '#FFFFFF', fontWeight: 600, '&:hover': { background: '#E11D48' } }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analytics Stats popup modal */}
      <Dialog
        open={statsOpen}
        onClose={handleCloseStats}
        PaperProps={{
          sx: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3.5,
            maxWidth: '500px',
            width: '100%',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          Election Statistics: {activeElectionForStats?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 500 }}>Category Position:</Typography>
            <Typography sx={{ fontWeight: 700, color: '#38BDF8' }}>{activeElectionForStats?.position}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 500 }}>Current status:</Typography>
            <Chip
              label={activeElectionForStats?.status}
              size="small"
              sx={{
                background: getStatusStyle(activeElectionForStats?.status).bg,
                color: getStatusStyle(activeElectionForStats?.status).color,
                fontWeight: 700
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 500 }}>Running Nominees Count:</Typography>
            <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.15rem' }}>
              {statistics?.candidateCount ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 500 }}>Voters Count:</Typography>
            <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.15rem' }}>
              {statistics?.voterCount ?? 0}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseStats}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Close Stats
          </Button>
        </DialogActions>
      </Dialog>

      <Loader open={loading} />

      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            background: toastSeverity === 'error' ? '#F43F5E' : '#10B981',
            fontWeight: 600
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageElections;
