import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingOverlay = ({ isLoading }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: isLoading ? 'auto' : 'none',
      }}
    >
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingOverlay;
