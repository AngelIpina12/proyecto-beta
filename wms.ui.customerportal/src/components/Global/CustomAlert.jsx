import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

const CustomAlert = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Fade}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%', zIndex: 10000 }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;