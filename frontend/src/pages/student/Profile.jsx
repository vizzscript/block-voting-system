import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Typography, TextField, MenuItem, Button, Snackbar, Alert, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/slices/authSlice';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Electrical & Electronics Engineering',
  'Civil Engineering',
  'Information Technology'
];

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Reset form values once user details are resolved
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        department: user.department,
        year: user.year
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(updateUserProfile(data)).unwrap();
      if (res) {
        setToastMessage('Profile updated successfully!');
        setToastSeverity('success');
        setToastOpen(true);
      }
    } catch (err) {
      setToastMessage(err || 'Failed to update profile.');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        My Profile
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        View and update your student registration records
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.35)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF' }}>
                    Personal Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    {...register('fullName', { required: 'Name is required' })}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#475569' }} />
                        </InputAdornment>
                      ),
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon sx={{ color: '#475569' }} />
                        </InputAdornment>
                      ),
                    }}
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
                    label="Academic Year"
                    variant="outlined"
                    defaultValue=""
                    {...register('year', { required: 'Academic year is required' })}
                    error={!!errors.year}
                    helperText={errors.year?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: '#475569' }} />
                        </InputAdornment>
                      ),
                    }}
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
                    {YEARS.map((yr) => (
                      <MenuItem key={yr} value={yr}>{yr}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 5,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.35)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#FFFFFF' }}>
              Security Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <TextField
                fullWidth
                label="Student ID"
                value={user?.studentId || 'N/A'}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: '#475569' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled': {
                    color: '#94A3B8',
                    WebkitTextFillColor: '#94A3B8',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' },
                  },
                  '& .MuiInputLabel-root.Mui-disabled': { color: '#475569' },
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                value={user?.email || 'N/A'}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#475569' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled': {
                    color: '#94A3B8',
                    WebkitTextFillColor: '#94A3B8',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' },
                  },
                  '& .MuiInputLabel-root.Mui-disabled': { color: '#475569' },
                }}
              />

              <TextField
                fullWidth
                label="Assigned System Role"
                value={user?.role?.toUpperCase() || 'STUDENT'}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#475569' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled': {
                    color: '#94A3B8',
                    WebkitTextFillColor: '#94A3B8',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' },
                  },
                  '& .MuiInputLabel-root.Mui-disabled': { color: '#475569' },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

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

export default Profile;
