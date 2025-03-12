import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { setRequirementDetailData, resetRequirementDetailData } from '../../../store/Requirements/slices/requirementDetailDataSlice';

import CustomAlert from '../../../components/Global/CustomAlert';
import ConfirmationModal from '../../../components/Global/ConfirmationModal';

export const RequirementsManualAddModal = ({ open, onClose, onAdd }) => {
  // Redux
  const dispatch = useDispatch();
  const requirementDetailData = useSelector((state) => state.requirementDetailData);
  // Hooks
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    if (open) {
      dispatch(resetRequirementDetailData());
    }
  }, [open, dispatch]);

  // Cuando se guarda el detalle del requerimiento
  const handleSave = () => {
    if (!requirementDetailData.Sku || !requirementDetailData.Quantity) {
      setAlert({ open: true, message: "Por favor, ingresa al menos un SKU y una cantidad", severity: 'warning' });
      return;
    }
    setConfirmOpen(true);
  };

  // Cuando se confirma el guardado del detalle del requerimiento
  const handleConfirmSave = async () => {
    try {
      const dataToSubmit = { ...requirementDetailData };
      onAdd(dataToSubmit);
      onClose();
      setAlert({ open: true, message: 'Detalle de requerimiento agregado correctamente.', severity: 'success' });
      setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    } catch (error) {
      setAlert({ open: true, message: 'Ha ocurrido un error. Vuelve a intentarlo.', severity: 'error' });
      setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    } finally {
      setConfirmOpen(false);
    }
  };

  // Cuando se cambia el valor de un campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setRequirementDetailData({ ...requirementDetailData, [name]: value }));
  };

  // Cuando se cierra el modal
  const handleClose = () => {
    dispatch(resetRequirementDetailData());
    onClose(); 
  };

  // Cuando se cierra el alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Estilos para el input
  const inputStyle = {
    mb: 2,
    bgcolor: '#f9f9f9',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#3f51b5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
      },
    },
  };

  return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" disableEnforceFocus disableRestoreFocus>
        <DialogTitle>
          Add Manual Requirement
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 18, top: 8, padding: '8px' }}
          >
            <CloseIcon  />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU"
                  variant="outlined"
                  fullWidth
                  name="Sku"
                  value={requirementDetailData.Sku || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lot"
                  variant="outlined"
                  fullWidth
                  name="Lot"
                  value={requirementDetailData.Lot || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  name="Quantity"
                  value={requirementDetailData.Quantity || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="PO"
                  variant="outlined"
                  fullWidth
                  name="Po"
                  value={requirementDetailData.Po || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Production Line"
                  variant="outlined"
                  fullWidth
                  name="ProductionLine"
                  value={requirementDetailData.ProductionLine || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Release"
                  variant="outlined"
                  fullWidth
                  name="Release"
                  value={requirementDetailData.Release || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Comment"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  name="Comment"
                  value={requirementDetailData.Comment || ''}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Agregar
          </Button>
          <ConfirmationModal
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleConfirmSave}
            disableEnforceFocus
          />
        </DialogActions>
        <CustomAlert
          open={alert.open}
          onClose={handleCloseAlert}
          severity={alert.severity}
          message={alert.message}
        />
      </Dialog>
  );
};