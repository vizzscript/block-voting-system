import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Grid, MenuItem, InputAdornment, IconButton, Alert, Snackbar } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError, resetRegisterSuccess } from '../store/slices/authSlice';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';
import Loader from '../components/Loader';

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

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, registerSuccess } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('error');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch('password');

  // Handle successful registration redirection
  useEffect(() => {
    if (registerSuccess) {
      setToastMessage('Registration successful! Redirecting to login...');
      setToastSeverity('success');
      setToastOpen(true);
      dispatch(resetRegisterSuccess());
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [registerSuccess, navigate, dispatch]);

  // Handle incoming Redux registration errors
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity('error');
      setToastOpen(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle at center, #0F172A 0%, #020617 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 900,
                letterSpacing: -0.5,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Register as a student voter to participate in college elections
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  variant="outlined"
                  {...register('studentId', {
                    required: 'Student ID is required',
                    maxLength: { value: 50, message: 'ID too long' }
                  })}
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: '#475569' }} />
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
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  {...register('fullName', {
                    required: 'Full name is required',
                    maxLength: { value: 100, message: 'Name too long' }
                  })}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#475569' }} />
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
                  <MenuItem value="" disabled>Select Department</MenuItem>
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
                  <MenuItem value="" disabled>Select Year</MenuItem>
                  {YEARS.map((yr) => (
                    <MenuItem key={yr} value={yr}>{yr}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#475569' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#64748B' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match'
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#475569' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#64748B' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                py: 1.8,
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                borderRadius: 2.5,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(6, 182, 212, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338CA 0%, #0891B2 100%)',
                  boxShadow: '0 8px 25px rgba(6, 182, 212, 0.45)',
                }
              }}
            >
              Register Now
            </Button>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Already have an account?{' '}
              <Box
                component="span"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#38BDF8',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign In here
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Container>

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

export default Register;
