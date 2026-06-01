import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PollIcon from '@mui/icons-material/Poll';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const handlePortalClick = () => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle at 50% 50%, #0F172A 0%, #020617 100%)',
        color: '#F8FAFC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 8
      }}
    >
      {/* Background glow graphics */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'rgba(79, 70, 229, 0.12)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'rgba(6, 182, 212, 0.12)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ zIndex: 1, position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              letterSpacing: 2,
              background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase'
            }}
          >
            Phase 1 Release • College Election Portal
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '4rem', md: '5rem' },
              fontWeight: 900,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              mt: 2,
              mb: 3,
              background: 'linear-gradient(to right, #FFFFFF, #94A3B8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Blockchain-Based <br />
            <Box component="span" sx={{ color: '#06B6D4' }}>Secure Voting</Box> Mechanism
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#94A3B8',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 5,
              fontSize: { xs: '1.1rem', sm: '1.3rem' }
            }}
          >
            Experience the future of transparent and secure student democracy. Powered by advanced cryptographic access controls, candidate auditing, and structured ballot parameters.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handlePortalClick}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                px: 5,
                py: 2,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1.05rem',
                textTransform: 'none',
                boxShadow: '0 8px 30px rgba(6, 182, 212, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338CA 0%, #0891B2 100%)',
                  boxShadow: '0 10px 35px rgba(6, 182, 212, 0.5)',
                }
              }}
            >
              Enter Voting Portal
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 2,
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    background: 'rgba(255,255,255,0.05)',
                    borderWidth: 2
                  }
                }}
              >
                Register as Student
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            {
              title: 'User Management',
              desc: 'Secure RBAC architecture distinguishing Student voters from System Admins. Authenticated via rolling JWT security sessions.',
              icon: <SecurityIcon sx={{ fontSize: 40, color: '#06B6D4' }} />
            },
            {
              title: 'Candidate Profiling',
              desc: 'Structured nominee manifestos, profile image uploads, and robust filter models allowing voters to audit candidates before voting.',
              icon: <HowToRegIcon sx={{ fontSize: 40, color: '#818CF8' }} />
            },
            {
              title: 'Election State Control',
              desc: 'Complete lifecycle manager moving ballots dynamically from Draft, Scheduled, and Active states onto Completed and Cancelled tags.',
              icon: <PollIcon sx={{ fontSize: 40, color: '#F43F5E' }} />
            }
          ].map((feat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  background: 'rgba(30, 41, 59, 0.45)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 4,
                  height: '100%',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    {feat.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#FFFFFF' }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
