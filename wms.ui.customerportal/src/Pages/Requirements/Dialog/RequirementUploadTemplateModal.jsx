import React, { useEffect, useState } from 'react';

import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  Grid, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useSelector, useDispatch } from 'react-redux';
import { setRequirementData, resetRequirementData, updateAndSetCombinedData } from '../../../store/Requirements/slices/requirementDataSlice';
import { resetRequirementDetailData  } from '../../../store/Requirements/slices/requirementDetailDataSlice';
import { setCombinedData, resetCombinedData } from '../../../store/Requirements/slices/combinedDataSlice';

import { RequirementsManualAddModal } from './RequirementsManualAddModal';
import { FileUpload } from '../../../components/Requirements/FileUpload';
import CustomAlert from '../../../components/Global/CustomAlert';
import ConfirmationModal from '../../../components/Global/ConfirmationModal';
import { TablePagination } from '../../../components/Global/TablePagination';

import { RequirementsAPI } from '@/services/RequirementsAPI';

import dayjs from 'dayjs';

export const RequirementsUploadTemplateModal = ({ open, onClose, userId, customerInfo }) => {
  // Redux
  const dispatch = useDispatch();
  const requirementData = useSelector((state) => state.requirementData);
  const combinedData = useSelector((state) => state.combinedData);
  // Estados
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [manualAddModalOpen, setManualAddModalOpen] = useState(false);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cuando se abre el modal
  useEffect(() => {
    const currentDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const currentTime = dayjs().format('HH:mm:ss');

    // Establecer datos iniciales
    dispatch(setRequirementData({
      ...requirementData,
      AddedDate: currentDateTime,
      RequirementDate: currentDateTime,
      RequirementTime: currentTime,
    }));

    if (open) {
      dispatch(resetCombinedData());
      setPage(0);
      setRowsPerPage(10);
      console.log(customerInfo);
      const fetchData = async () => {
        try {
          const response = await RequirementsAPI.GetRequirementTypes();
          setRequirementTypes(response.data);
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
      };
      fetchData();
    }
  }, [open]);
  
  // Cuando se agrega un requerimiento manualmente
  const handleManualAdd = (newRequirement) => {
    dispatch(setRequirementData({
      ...requirementData,
      ExtRequirementDetails: [...requirementData.ExtRequirementDetails, newRequirement]
    }));
    const updatedCombinedData = [...combinedData, newRequirement];
    dispatch(setCombinedData(updatedCombinedData));
  };

  // Cuando se procesa el archivo de Excel
  const handleFileProcessed = (processedData) => {
    try {
      dispatch(updateAndSetCombinedData(processedData.rows));
      setAlert({ open: true, message: "Plantilla de Excel procesada correctamente.", severity: 'success' });
      setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      setAlert({ open: true, message: "Error al procesar la plantilla. Inténtalo de nuevo.", severity: 'error' });
      setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    }
  };

  // Cuando se guarda el requerimiento
  const handleSave = () => {
    const missingFields = [];
    if (!requirementData.MaterialFrom) {
        missingFields.push("Material From/For");
    }
    if (!requirementData.RequirementFolioNumber) {
        missingFields.push("Requirement #");
    }
    if (!requirementData.RequirementTypeId) {
        missingFields.push("Requirement Type");
    }
    if (missingFields.length === 0 && Array.isArray(combinedData) && combinedData.length === 0) {
        setAlert({ open: true, message: "Por favor, introduce al menos un detalle de requerimiento.", severity: 'warning' });
        return;
    }
    if (missingFields.length > 0) {
        const alertMessage = `Por favor, introduce los siguientes campos: ${missingFields.join(", ")}.`;
        setAlert({ open: true, message: alertMessage, severity: 'warning' });
    } else {
        setConfirmOpen(true);
    }
    setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
  };

  // Cuando se confirma el guardado del requerimiento
  const handleConfirmSave = async () => {
    setIsLoading(true);
    try {
      const currentDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
      const currentTime = dayjs().format('HH:mm:ss');

      const productDetails = combinedData.map(detail => ({
        Sku: detail.Sku,
        CustomerId: String(customerInfo.customerId)
      }));

      const response = await RequirementsAPI.GetProductDetails(productDetails);

      const updatedDetails = combinedData.map((detail, index) => ({
        ...detail,
        CustomerProductId: response.data[index]?.customerProductId || null
      }));

      const requirementJSON = {  
        ...requirementData,
        AddedBy: userId,
        AddedDate: currentDateTime,
        RequirementDate: currentDateTime,
        RequirementTime: currentTime,
        ExtRequirementDetails: updatedDetails,
        CQCustomerId: customerInfo.wareCustomerId
      };

      await RequirementsAPI.PostRequirement(requirementJSON);
      dispatch(resetRequirementDetailData());
      dispatch(resetCombinedData());
      onClose();
      setAlert({ open: true, message: 'Requerimiento agregado correctamente.', severity: 'success' });
      setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    } catch (error) {
      setAlert({ open: true, message: 'Ha ocurrido un error. Vuelve a intentarlo.', severity: 'error' });
      setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    } finally {
      setIsLoading(false);
      setConfirmOpen(false);
    }
  };

  // Cuando se cierra el modal
  const handleClose = () => { 
    onClose();
    dispatch(resetRequirementData());
  };

  // Cuando se cierra el alert
  const handleCloseAlert = () => { setAlert({ ...alert, open: false }) };

  // Cuando se cambia el valor de un campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setRequirementData({ ...requirementData, [name]: value }));
  };

  // Cuando se cambia la página
  const handleChangePage = (event, newPage) => { setPage(newPage) };

  // Cuando se cambia el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Estilos para el grid
  const GridStyle = {
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "auto",
        height: '100%',
        width: '100%',
    },
    head: {
        color: 'white',
        bgcolor: 'gray'
    }
  };

  // Filas paginadas
  const paginatedRows = combinedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Encabezados por defecto
  const defaultHeaders = ['SKU Name', 'Supplier', 'Description', 'Quantity', 'Lot', 'Production Line', 'Po', 'Release', 'Comment'];

  return (
  <>
    <CustomAlert
      open={alert.open}
      onClose={handleCloseAlert}
      severity={alert.severity}
      message={alert.message}
    />
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none', zIndex: 1000 } }} maxWidth="lg" disableEnforceFocus disableRestoreFocus fullWidth>
      <DialogTitle id="draggable-dialog-title">
        Uploaded Requirements
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => handleClose()}
            aria-label="close"
            sx={{ position: 'absolute', right: 18, top: 8, padding: '8px' }}
          >
          <CloseIcon  />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>

          {/* Botón para agregar requerimiento manualmente */}
          <Grid container spacing={20}>
            <Grid item xs={12} sm={5}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                  <Button
                    variant="contained"
                    component="span"
                    color="primary"
                    sx={{width: '130px', minWidth: '130px'}}
                    onClick={() => setManualAddModalOpen(true)}
                  >Manual Add
                  </Button>
                
                {/* Botón para subir archivo */}
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained" 
                      component="span"
                      color="primary"
                    >Upload
                    </Button>
                  </label>
                <FileUpload onFileProcessed={handleFileProcessed} />

                {/* Botón para descargar plantilla */}
                  <Button
                    variant="contained"
                    component="a"
                    color="primary"
                    href="assets/ExternalRequirements.xlsx"
                    sx={{ width: '190px', minWidth: '190px', '&:hover': { color: 'white' } }}
                    download
                  >Download Template
                  </Button>
                </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date / Time"
                      value={dayjs(requirementData.RequirementDate)}
                      onChange={(newValue) => dispatch(setRequirementData({ ...requirementData, RequirementDate: newValue }))}
                      disabled
                      components={{
                        TextField: (props) => (
                          <TextField {...props} fullWidth />
                        ),
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="material-for-label">Material from/for</InputLabel>
                    <Select
                      value={requirementData.MaterialFrom !== null ? requirementData.MaterialFrom : ''}
                      onChange={(e) => dispatch(setRequirementData({ ...requirementData, MaterialFrom: e.target.value }))}
                      labelId="material-for-label"
                      id="material-for-select"
                      label="Material from/for"
                      MenuProps={{
                        PaperProps: {
                          sx: { '& .MuiListSubheader-root': { backgroundColor: '#f0f0f0' } },
                        },
                      }}
                    >
                    <MenuItem key={customerInfo.customerId} value={customerInfo.customerId}>
                      {customerInfo.customerName}
                    </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Requeriment #"
                    variant="outlined"
                    fullWidth
                    name="RequirementFolioNumber"
                    value={requirementData.RequirementFolioNumber || ''}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="requirement-type-label">Requirement Type</InputLabel>
                    <Select
                      value={requirementData.RequirementTypeId !== null ? requirementData.RequirementTypeId : ''}
                      onChange={(e) => dispatch(setRequirementData({ ...requirementData, RequirementTypeId: e.target.value }))}
                      labelId="requirement-type-label"
                      id="requirement-type-select"
                      label="Requirement Type"
                      MenuProps={{
                        PaperProps: {
                          sx: { 
                            maxHeight: 200,
                            overflowY: 'auto',
                            '& .MuiListSubheader-root': { backgroundColor: '#f0f0f0' },
                            '&::-webkit-scrollbar': {
                              width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                              backgroundColor: '#f0f0f0',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: '#888', 
                              borderRadius: '4px', 
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                              backgroundColor: '#555',
                            },
                          },
                        },
                      }}
                    >
                    {requirementTypes.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.requirementName}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Modal para agregar requerimiento manualmente */}
          <RequirementsManualAddModal
            open={manualAddModalOpen}
            onClose={() => setManualAddModalOpen(false)}
            onAdd={handleManualAdd}
          />

        </Box>
        {combinedData.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 550, tableLayout: 'fixed' }} aria-label='simple table'>
                <TableHead>
                  <TableRow sx={GridStyle.head}>
                    {defaultHeaders.map((header, index) => (
                      <TableCell key={index} align='left' sx={{ color: 'white' }}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} sx={{ height: '40px', bgcolor: rowIndex % 2 === 0 ? 'white' : 'grey.200' }}>
                      <TableCell>{row.Sku}</TableCell>
                      <TableCell>{row.Supplier}</TableCell>
                      <TableCell>{row.Description}</TableCell>
                      <TableCell>{row.Quantity}</TableCell>
                      <TableCell>{row.Lot}</TableCell>
                      <TableCell>{row.ProductionLine}</TableCell>
                      <TableCell>{row.Po}</TableCell>
                      <TableCell>{row.Release}</TableCell>
                      <TableCell>{row.Comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              count={combinedData.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={GridStyle.head}>
                  {defaultHeaders.map((header, index) => (
                    <TableCell key={index} align='left' sx={{ color: 'white' }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={defaultHeaders.length} align="center">No data available.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => handleClose()}>
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <ConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSave}
          isLoading={isLoading}
          disableEnforceFocus
        />
      </DialogActions>
    </Dialog>
  </>
  );
};