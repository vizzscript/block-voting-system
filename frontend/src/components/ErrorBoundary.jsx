import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'radial-gradient(circle at center, #0F172A 0%, #020617 100%)',
            color: '#F8FAFC',
            p: 3
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 5,
              maxWidth: 500,
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#F43F5E', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
              An unexpected error occurred in the application. Please try reloading the page or contact support if the issue persists.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338CA 0%, #0891B2 100%)',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.6)',
                }
              }}
            >
              Reload Application
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
