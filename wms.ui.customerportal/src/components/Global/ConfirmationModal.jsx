import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import LoadingOverlay from './LoadingOverlay';


const ConfirmationModal = ({ open, onClose, onConfirm, isLoading }) => {
    return (
      <Dialog open={open} onClose={onClose} disableEnforceFocus disableRestoreFocus>
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas realizar dicha acción?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">Cancelar</Button>
          <Button onClick={onConfirm} color="primary">Confirmar</Button>
        </DialogActions>
        <LoadingOverlay isLoading={isLoading} />
      </Dialog>
    );
  };

export default ConfirmationModal;