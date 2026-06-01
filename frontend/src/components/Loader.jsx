import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const Loader = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: '#06B6D4',
        zIndex: (theme) => theme.zIndex.drawer + 999,
        background: 'rgba(2, 6, 23, 0.7)',
        backdropFilter: 'blur(8px)',
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={60} thickness={4.5} />
    </Backdrop>
  );
};

export default Loader;
