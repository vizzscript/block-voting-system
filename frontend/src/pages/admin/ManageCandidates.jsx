import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Avatar, Snackbar, Alert, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidates, createCandidate, updateCandidate, deleteCandidate, resetCandidateSuccess, clearCandidateError } from '../../store/slices/candidateSlice';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Loader from '../../components/Loader';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Electrical & Electronics Engineering',
  'Civil Engineering',
  'Information Technology'
];

const POSITIONS = [
  'President',
  'Vice President',
  'General Secretary',
  'Treasurer',
  'Sports Secretary'
];

const ManageCandidates = () => {
  const dispatch = useDispatch();
  const { candidates, loading, error, success } = useSelector((state) => state.candidates);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  // Handle operation outcomes (success or error notifications)
  useEffect(() => {
    if (success) {
      setToastMessage(editingCandidate ? 'Candidate updated successfully!' : 'Candidate registered successfully!');
      setToastSeverity('success');
      setToastOpen(true);
      setDialogOpen(false);
      dispatch(resetCandidateSuccess());
    }
  }, [success, editingCandidate, dispatch]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity('error');
      setToastOpen(true);
      dispatch(clearCandidateError());
    }
  }, [error, dispatch]);

  const handleOpenAdd = () => {
    setEditingCandidate(null);
    reset({
      candidateName: '',
      studentId: '',
      department: '',
      position: '',
      manifesto: '',
      profileImage: ''
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (cand) => {
    setEditingCandidate(cand);
    reset({
      candidateName: cand.candidateName,
      studentId: cand.studentId,
      department: cand.department,
      position: cand.position,
      manifesto: cand.manifesto,
      profileImage: cand.profileImage || ''
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (cand) => {
    setCandidateToDelete(cand);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDelete = () => {
    setCandidateToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const onSubmit = (data) => {
    if (editingCandidate) {
      dispatch(updateCandidate({ id: editingCandidate.id, candidateData: data }));
    } else {
      dispatch(createCandidate(data));
    }
  };

  const handleConfirmDelete = async () => {
    if (candidateToDelete) {
      try {
        await dispatch(deleteCandidate(candidateToDelete.id)).unwrap();
        setToastMessage('Candidate deleted successfully!');
        setToastSeverity('success');
        setToastOpen(true);
      } catch (err) {
        setToastMessage(err || 'Failed to delete candidate.');
        setToastSeverity('error');
        setToastOpen(true);
      } finally {
        handleCloseDelete();
      }
    }
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
            Manage Candidates
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8' }}>
            Register new candidate profiles and curate campaign manifestos
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
          Add Nominee
        </Button>
      </Box>

      {/* Candidates Datatable */}
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
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Nominee</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#64748B', py: 8 }}>
                  <HowToRegIcon sx={{ fontSize: 48, mb: 1, color: '#475569' }} />
                  <Typography>No election nominees registered in system yet.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((cand) => (
                <TableRow
                  key={cand.id}
                  sx={{
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.02)',
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={cand.profileImage}
                        sx={{
                          width: 38,
                          height: 38,
                          background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {cand.candidateName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{cand.candidateName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#06B6D4' }}>{cand.studentId}</TableCell>
                  <TableCell>{cand.position}</TableCell>
                  <TableCell>{cand.department}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEdit(cand)} sx={{ color: '#38BDF8', mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDelete(cand)} sx={{ color: '#F43F5E' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog popup */}
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
          {editingCandidate ? 'Modify Nominee Details' : 'Register New Nominee'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nominee Name"
                  variant="outlined"
                  {...register('candidateName', { required: 'Nominee name is required' })}
                  error={!!errors.candidateName}
                  helperText={errors.candidateName?.message}
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
                  label="Student ID"
                  variant="outlined"
                  {...register('studentId', { required: 'Student ID is required' })}
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
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
                  label="Department"
                  variant="outlined"
                  defaultValue=""
                  {...register('department', { required: 'Department is required' })}
                  error={!!errors.department}
                  helperText={errors.department?.message}
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
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Running Position"
                  variant="outlined"
                  defaultValue=""
                  {...register('position', { required: 'Running position is required' })}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image Link (Optional)"
                  variant="outlined"
                  {...register('profileImage')}
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
                  rows={4}
                  label="Nominee manifesto"
                  variant="outlined"
                  {...register('manifesto', { required: 'Nominee manifesto is required' })}
                  error={!!errors.manifesto}
                  helperText={errors.manifesto?.message}
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
                {editingCandidate ? 'Save Changes' : 'Register Nominee'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Warning */}
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
            Are you absolutely sure you want to delete nominee <strong>{candidateToDelete?.candidateName}</strong>? This action will permanently wipe this candidate profile from all lists and database entries.
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

export default ManageCandidates;
