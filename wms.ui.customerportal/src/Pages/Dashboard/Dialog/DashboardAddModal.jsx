import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import CustomAlert from '../../../components/Global/CustomAlert';
import ConfirmationModal from '../../../components/Global/ConfirmationModal';
import { KPIAPI } from '../../../services/KPIAPI';
import { getTokenInfo } from '../../../utils';

export const DashboardAddModal = ({ open, onClose, onAdd, onAddAlert }) => {
  // Hooks
  const [newModalData, setNewModalData] = useState({ name: '', x: 100, y: 100 });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [idUserState, setIdUserState] = useState(0);
  const [getModules, setGetModules] = useState(false);
  const [categoriesListData, setCategoriesListData] = useState([]);
  const [reportsListData, setReportsListData] = useState([]);

  // Cuando se cierra y se abre el modal
  useEffect(() => {
    if (!open) {
      setSelectedCategory('');
      setSelectedReport('');
      setReportsListData([]);
    }
  }, [open]);

  // Obtener el UserId
  useEffect(() => {
    const ldata = getTokenInfo();
    let lintid = parseInt(ldata.nameid);
    setIdUserState(lintid);
  }, []);

  useEffect(() => {
    if (idUserState) {
      const fetchData = async () => {
        try {
          const { data } = await KPIAPI.GetCustomerModules();
          setCategoriesListData(data);
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
      };
      fetchData();
    }
  }, [idUserState]);

  useEffect(() => {
    if (getModules) {
      const fetchData = async () => {
        try {
          const { data: KPIOptions } = await KPIAPI.GetKPIOptions(idUserState);
          const dataFiltered = KPIOptions.filter(option => option.intModuleId === selectedCategory && option.intActive == 1);

          setReportsListData(dataFiltered);

          // Si no hay reportes relacionados con la categoría seleccionada
          if (dataFiltered.length === 0) {
            setAlert({
              open: true,
              message: 'No hay reportes disponibles para la categoría seleccionada.',
              severity: 'warning',
            });
          }
        } catch (error) {
          console.log('Error fetching data: ', error);
        } finally {
          // Asegura que el combo de reportes esté bloqueado si no hay coincidencias
          if (reportsListData.length === 0) {
            setSelectedReport(''); // Resetea el valor seleccionado
          }
        }
      };
      fetchData();
    }
  }, [selectedCategory, idUserState, getModules]);

  // Cuando se guarda el modal
  const handleSave = () => {
    if (!selectedCategory) {
      setAlert({ open: true, message: 'Por favor, selecciona una categoría.', severity: 'warning' });
      return;
    }
    if (selectedCategory && !selectedReport) {
      setAlert({ open: true, message: 'Por favor, selecciona una reporte.', severity: 'warning' });
      return;
    }
    setConfirmOpen(true);
  };

  // Cuando se confirma el guardado del modal
  const handleConfirmSave = () => {
    const report = reportsListData.find((report) => report.intOptionId === parseInt(selectedReport));
    if (report) {
      onAdd({ ...newModalData, id: Math.round(Math.random() * 1000), name: report.strDisplayText, url: report.strUrl });
      onAddAlert(`Modal agregado correctamente.`, 'success');
      setNewModalData({ name: '', x: 100, y: 100 });
      setSelectedReport('');
      setSelectedCategory('');
      onClose();
      setConfirmOpen(false);
      setGetModules(false);
    }
  };

  // Cuando se cambia el valor del combo de categorias
  const handleCategoriesSelectChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedReport("");
    setGetModules(true);
  };

  // Cuando se cambia el valor del combo de reportes
  const handleReportsSelectChange = (e) => {
    setSelectedReport(e.target.value);
  };

  // Cuando se cierra el modal
  const handleClose = () => {
    setNewModalData({ name: '', x: 100, y: 100 });
    setSelectedReport('');
    setSelectedCategory('');
    setReportsListData([]);
    setAlert({ open: false, message: '', severity: '' });
    onClose();
    setGetModules(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" disableEnforceFocus disableRestoreFocus>
      <DialogTitle>
        Agregar indicador
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 18, top: 8, padding: '8px' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="select-category-label">Selecciona una categoría</InputLabel>
            <Select
              labelId="select-category-label"
              value={selectedCategory}
              onChange={handleCategoriesSelectChange}
              label="Selecciona una categoría"
            >
              {categoriesListData
                .filter(cat => cat.strModuleName.toLowerCase() !== 'base')
                .map((category) => (
                  <MenuItem key={category.intModuleId} value={category.intModuleId}>
                    {category.strModuleName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{
            mb: 2,
            backgroundColor: !selectedCategory || reportsListData.length === 0 ? '#f0f0f0' : 'white',
            borderRadius: '4px',
            '& .MuiSelect-root': {
              color: !selectedCategory || reportsListData.length === 0 ? '#9e9e9e' : 'inherit',
            },
          }}>
            <InputLabel id="select-report-label">Selecciona un reporte</InputLabel>
            <Select
              labelId="select-report-label"
              value={selectedReport}
              onChange={handleReportsSelectChange}
              label="Selecciona un reporte"
              disabled={!selectedCategory || reportsListData.length === 0}
            >
              {reportsListData.map((report) => (
                <MenuItem key={report.intOptionId} value={report.intOptionId}>
                  {report.strDisplayText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </Dialog>
  );
};