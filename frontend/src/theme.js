import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#06B6D4', // Cyan neon
      light: '#67E8F9',
      dark: '#0891B2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6366F1', // Indigo
      light: '#A5B4FC',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#020617', // Deep Navy
      paper: '#0F172A',   // Slate Dark
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
    },
    button: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
