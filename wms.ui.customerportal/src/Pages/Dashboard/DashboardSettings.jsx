import React, { useEffect, useState } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Switch, Container, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useAuthRedirect } from '../../utils';
import { getTokenInfo } from '../../utils';
import { KPIAPI } from '../../services/KPIAPI';
import ConfirmationModal from '../../components/Global/ConfirmationModal';
import CustomAlert from '../../components/Global/CustomAlert';
import { TablePagination } from '../../components/Global/TablePagination';
import LoadingOverlay from '../../components/Global/LoadingOverlay';

export const DashboardSettings = () => {
    useAuthRedirect();
    const [Iduserstate, setIduserstate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [warehouseSelect, setWarehouseSelect] = useState([]);
    const [warehouse, setWarehouse] = useState("");
    const [customerSelect, setCustomerSelect] = useState([]);
    const [customer, setCustomer] = useState("");
    const [customerSelectIsFull, setCustomerSelectIsFull] = useState(false);
    const [usuariosSelect, setUsuariosSelect] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [categoriasSelect, setCategoriasSelect] = useState([]);
    const [categoria, setCategoria] = useState(0);
    const [titulo, setTitulo] = useState('');
    const [leyenda, setLeyenda] = useState('');
    const [url, setUrl] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [reportsData, setReportsData] = useState([]);
    const [modifiedData, setModifiedData] = useState([]);
    const [isInsertSetting, setIsInsertSetting] = useState(false);
    const [isUpdatingSetting, setIsUpdatingSetting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isBoxEnabled, setIsBoxEnabled] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editUserId, setEditUserId] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editLegend, setEditLegend] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editOptionId, setEditOptionId] = useState(null);
    const [editActive, setEditActive] = useState(null);
    const [editConfirmOpen, setEditConfirmOpen] = useState(false);


    // Obtener el UserId
    useEffect(() => {
        const ldata = getTokenInfo();
        let lintid = ldata.nameid;
        setIduserstate(lintid);
    }, []);

    // Obtener listado para combo de Warehouse
    useEffect(() => {
        if (Iduserstate) {
            const fetchWarehousesData = async () => {
                try {
                    setIsLoading(true);
                    const filters = { UserId: Iduserstate };
                    const { data } = await KPIAPI.GetWarehousesToSelect(filters);
                    setWarehouseSelect(data);
                } catch (error) {
                    console.log('Error fetching data: ', error);
                    setAlert({ open: true, message: 'Hubo un error al obtener los warehouses.', severity: 'error' });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchWarehousesData();
        }
    }, [Iduserstate]);


    // Función para obtener la información de la tabla de estatus
    const fetchAllData = async () => {
        if (warehouse.length === 0 || customer.length === 0) {
            return setAlert({ open: true, message: 'Por favor, llena los campos de warehouse y customer.', severity: 'error' });
        }
        try {
            setIsLoading(true);
            const usersFilter = { intUserId: Iduserstate, intWareHouseId: warehouse, intCustomerId: customer };
            const reportsFilter = { intWarehouseid: warehouse, intCustomerid: customer };
            const [usersResponse, categoriesResponse, reportsResponse] = await Promise.all([
                KPIAPI.GetUsersToSelect(usersFilter),
                KPIAPI.GetCustomerModules(),
                KPIAPI.GetKPIOptionsForWarehouseAndCustomer(reportsFilter)
            ]);
            setUsuariosSelect(usersResponse.data);
            setCategoriasSelect(categoriesResponse.data);
            setReportsData(reportsResponse.data);
            setModifiedData(
                reportsResponse.data.map((item) => ({ ...item }))
            )
            if (usersResponse.data.length === 0) {
                setAlert({ open: true, message: 'No se encontraron usuarios para los filtros seleccionados.', severity: 'warning' });
            } else {
                // Mostrar alerta de éxito si hay usuarios
                setAlert({ open: true, message: 'Filtro aplicado correctamente.', severity: 'success' });
                setIsBoxEnabled(true);
            }
        } catch (error) {
            console.error('Error al filtrar:', error);
            setAlert({ open: true, message: 'Hubo un error al aplicar el filtro.', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const changesDetected = modifiedData.some((item, index) =>
            item.intCustOptionActive !== reportsData[index].intCustOptionActive
        );
        setHasChanges(changesDetected);
    }, [modifiedData, reportsData]);

    useEffect(() => { setIsBoxEnabled(false) }, [warehouse, customer]);

    const handleSwitchChange = (id, checked) => {
        setModifiedData((prevData) =>
            prevData.map((item) =>
                item.intOptionId === id ? { ...item, intCustOptionActive: checked ? 1 : 0 } : item
            )
        );
    };

    const resetFields = () => {
        setUsuarios([]);
        setCategoria(0);
        setTitulo('');
        setLeyenda('');
        setUrl('');
    };

    const handleAddSettingAlert = (message, severity) => {
        setAlert({ open: true, message: message, severity: severity });
        setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    };

    const handleWarehouseChange = async (event) => {
        const selectedWarehouse = event.target.value;
        setWarehouse(selectedWarehouse);
        setCustomerSelectIsFull(false);
        try {
            setIsLoading(true);
            const filters = { intUserId: Iduserstate, intWareHouseid: selectedWarehouse };
            const { data } = await KPIAPI.GetCustomersToSelect(filters);
            setCustomerSelect(data);
            setCustomerSelectIsFull(true);
            setCustomer('');
            if (data.length === 0) {
                setAlert({
                    open: true,
                    message: 'No hay customers disponibles para el warehouse seleccionado.',
                    severity: 'warning',
                });
                setCustomerSelectIsFull(false);
            }
        } catch (error) {
            console.log('Error fetching customer data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomerChange = async (event) => setCustomer(event.target.value);

    const handleFilterWarehouseAndCustomer = async () => { await fetchAllData() };

    const handleUserChange = async (event) => setUsuarios(event.target.value);

    const handleCategoriaChange = async (event) => setCategoria(event.target.value);

    const handleConfirmSave = async () => {
        if (isInsertSetting) {
            try {
                setIsLoading(true);
                const existingReport = reportsData.find(report => report.intModuleId === categoria);
                const body = {
                    intUserIdAdmin: Iduserstate,
                    intOptionId: 0,
                    intModuleId: categoria,
                    intActive: existingReport ? existingReport.intCustOptionActive : 1,
                    listUsersIds: usuarios,
                    strTitle: titulo,
                    strLegend: leyenda,
                    strUrl: url
                };
                await KPIAPI.InsertUpdateCustomOption(body);
                handleAddSettingAlert(`Reporte ${existingReport ? 'actualizado' : 'agregado'} correctamente.`, 'success');
                resetFields();
                await fetchAllData();
            } catch (error) {
                console.log('Error fetching data: ', error);
                setAlert({ open: true, message: 'Hubo un error al agregar el reporte.', severity: 'error' });
            } finally {
                setIsInsertSetting(false);
                setConfirmOpen(false);
                setIsLoading(false);
            }
        } else if (isUpdatingSetting) {
            const changedItems = modifiedData.filter((item, index) =>
                item.intCustOptionActive !== reportsData[index].intCustOptionActive
            );

            if (changedItems.length === 0) {
                setAlert({ open: true, message: 'No hay cambios para guardar.', severity: 'warning' });
                return;
            }

            const body = changedItems.map((item) => ({
                intOptionId: item.intOptionId,
                intActive: item.intCustOptionActive,
                intUserIdAdmin: Iduserstate,
            }));

            try {
                handleAddSettingAlert(`Reporte actualizado correctamente.`, 'success');
                await KPIAPI.UpdateCustomOptions(body);
                await fetchAllData();
                resetFields();
                handleClose();
            } catch (error) {
                console.error("Error al guardar los cambios:", error);
                setAlert({ open: true, message: 'Hubo un error al actualizar el reporte.', severity: 'error' });
            } finally {
                setHasChanges(false);
                setIsUpdatingSetting(false);
                setConfirmOpen(false);
            }
        }
    };

    const handleConfirmEdit = async () => {
        try {
            setIsLoading(true);
            const body = {
                intUserIdAdmin: Iduserstate,
                intOptionId: editOptionId,
                intModuleId: editCategory,
                intActive: editActive,
                listUsersIds: [editUserId],
                strTitle: editTitle,
                strLegend: editLegend,
                strUrl: editUrl,
            };
            await KPIAPI.InsertUpdateCustomOption(body);
            await fetchAllData();
            setAlert({ open: true, message: 'Reporte actualizado correctamente.', severity: 'success' });
            setEditModalOpen(false);
        } catch (error) {
            console.error(error);
            setAlert({ open: true, message: 'Error al actualizar el reporte.', severity: 'error' });
        } finally {
            setEditConfirmOpen(false);
            setIsLoading(false);
        }
    };

    const handleSubmit = () => { setConfirmOpen(true); };

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

    // Cuando se cambia la página
    const handleChangePage = (event, newPage) => { setPage(newPage) };

    // Cuando se cambia el número de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditRow = (row) => {
        if (hasChanges) {
            setAlert({ open: true, message: 'Por favor, guarda los cambios primero', severity: 'warning' });
            return;
          }
        setEditOptionId(row.intOptionId);
        setEditUserId(row.intuserid);
        setEditCategory(row.intModuleId);
        const cleanTitle = row.strDisplayText.replace(/\(.*\)/, '').trim();
        setEditTitle(cleanTitle);
        setEditLegend(row.strLegend || '');
        setEditUrl(row.strUrl || '');
        setEditActive(Number(row.intCustOptionActive));
        setEditConfirmOpen(false);
        setEditModalOpen(true);
    };

    // Cuando se cierra el modal
    const handleClose = () => {
        setEditOptionId('');
        setEditCategory('');
        setEditTitle('');
        setEditLegend('');
        setEditUrl('');
        setEditActive('');
        setEditModalOpen(false);
        setEditConfirmOpen(false);
    };

    const paginatedData = modifiedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <Grid container spacing={2} style={{ maxWidth: '850px', margin: 'auto' }}>
                    <Grid item xs={5}>
                        <FormControl fullWidth>
                            <InputLabel id="warehouse-label">Warehouse</InputLabel>
                            <Select
                                labelId="warehouse-label"
                                id="warehouse"
                                name="warehouse"
                                value={warehouse}
                                onChange={handleWarehouseChange}
                            >
                                {warehouseSelect.map((warehouse) => (
                                    <MenuItem key={warehouse.intwarehouseid} value={warehouse.intwarehouseid}>
                                        {warehouse.strWarehouse}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                        <FormControl fullWidth sx={{
                            mb: 2,
                            backgroundColor: !customerSelectIsFull || warehouse.length === 0 ? '#f0f0f0' : 'white',
                            borderRadius: '4px',
                            '& .MuiSelect-root': {
                                color: !customerSelectIsFull || warehouse.length === 0 ? '#9e9e9e' : 'inherit',
                            },
                        }}>
                            <InputLabel id="customer-label">Customer</InputLabel>
                            <Select
                                labelId="customer-label"
                                id="customer"
                                name="customer"
                                value={customer || ''}
                                onChange={handleCustomerChange}
                                disabled={!customerSelectIsFull || warehouse.length === 0}
                            >
                                {customerSelect.map((customer) => (
                                    <MenuItem key={customer.intCustomerId} value={customer.intCustomerId}>
                                        {customer.strCustomerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            component="span"
                            color="primary"
                            onClick={handleFilterWarehouseAndCustomer}
                            fullWidth
                            sx={{ padding: '15px' }}
                        >Filtrar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                pointerEvents: isBoxEnabled ? 'auto' : 'none',
                opacity: isBoxEnabled ? 1 : 0,
            }}>
                <Container style={{ maxWidth: '1050px', margin: 'auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            marginBottom: '16px',
                            fontWeight: 'bold',
                            color: '#333',
                        }}
                    >
                        Crear un Reporte
                    </Box>
                    <Grid container spacing={2} style={{ maxWidth: '850px', margin: 'auto' }}>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="usuario-label">Usuarios</InputLabel>
                                <Select
                                    labelId="usuario-label"
                                    id="usuario"
                                    name="usuario"
                                    value={usuarios}
                                    onChange={handleUserChange}
                                    multiple
                                >
                                    {usuariosSelect.map((user) => (
                                        <MenuItem key={user.intUserId} value={user.intUserId}>
                                            {user.strFirstName} {user.strLastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="categoria-label">Categoría</InputLabel>
                                <Select
                                    labelId="categoria-label"
                                    id="categoria"
                                    name="categoria"
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                >
                                    <MenuItem value={0} disabled>Seleccione una categoria</MenuItem>
                                    {categoriasSelect.map((categoria) => (
                                        <MenuItem key={categoria.intModuleId} value={categoria.intModuleId}>
                                            {categoria.strModuleName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Título"
                                id="titulo"
                                name="titulo"
                                value={titulo}
                                onChange={(event) => setTitulo(event.target.value)}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Leyenda"
                                id="leyenda"
                                name="leyenda"
                                value={leyenda}
                                onChange={(event) => setLeyenda(event.target.value)}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="URL"
                                id="url"
                                name="url"
                                value={url}
                                onChange={(event) => setUrl(event.target.value)}
                            />
                        </Grid>

                        <Grid item xs={10}></Grid>
                        <Grid item xs={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    handleSubmit()
                                    setIsInsertSetting(true)
                                }}>
                                Configurar
                            </Button>
                        </Grid>
                        <ConfirmationModal
                            open={confirmOpen}
                            onClose={() => {
                                setConfirmOpen(false);
                                resetFields();
                            }}
                            onConfirm={handleConfirmSave}
                            disableEnforceFocus
                        />
                    </Grid>
                </Container>
                <TableContainer style={{ maxWidth: '1050px', margin: 'auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            marginBottom: '16px',
                            fontWeight: 'bold',
                            color: '#333',
                        }}
                    >
                        Configuración de Reportes
                    </Box>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow sx={GridStyle.head}>
                                <TableCell align='center' sx={{ padding: '7px', fontSize: '14px', color: 'white' }}>Categoría</TableCell>
                                <TableCell align='center' sx={{ padding: '7px', fontSize: '14px', color: 'white' }}>Reporte</TableCell>
                                <TableCell align='center' sx={{ padding: '7px', fontSize: '14px', color: 'white' }}>Usuario asignado</TableCell>
                                <TableCell align='center' sx={{ padding: '7px', fontSize: '14px', color: 'white' }}>Estatus</TableCell>
                                <TableCell align='center' sx={{ padding: '7px', fontSize: '14px', color: 'white' }}>Editar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                paginatedData.map((row, index) => (
                                    <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200', }}>
                                        <TableCell align="center" sx={{ padding: '5px', fontSize: '14px' }}>{row.strModuleName}</TableCell>
                                        <TableCell align="center" sx={{ padding: '5px', fontSize: '14px' }}>{row.strDisplayText}</TableCell>
                                        <TableCell align="center" sx={{ padding: '5px', fontSize: '14px' }}>{row.strUserFullName}</TableCell>
                                        <TableCell align="center" sx={{ padding: '5px', fontSize: '14px' }}>
                                            <Switch
                                                checked={row.intCustOptionActive === 1}
                                                onChange={(event) =>
                                                    handleSwitchChange(row.intOptionId, event.target.checked)
                                                }
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align='center' sx={{ padding: '5px', fontSize: '14px' }}>
                                            <Button onClick={() => handleEditRow(row)} sx={{ minWidth: 'auto', p: 0 }}>
                                                <EditNoteIcon sx={{ color: '#5e5e5e' }} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <TablePagination
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={reportsData.length}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleSubmit()
                                setIsUpdatingSetting(true)
                            }}
                            disabled={!hasChanges}
                        >
                            Guardar cambios
                        </Button>
                    </Box>
                    <ConfirmationModal
                        open={confirmOpen}
                        onClose={() => {
                            setConfirmOpen(false);
                            resetFields();
                        }}
                        onConfirm={handleConfirmSave}
                        disableEnforceFocus
                    />
                </TableContainer>
            </Box>
            <CustomAlert
                open={alert.open}
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                message={alert.message}
            />
            <Dialog open={editModalOpen} onClose={handleClose} fullWidth maxWidth="xs" disableEnforceFocus disableRestoreFocus>
                <DialogTitle>
                    Editar Reporte
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="edit-category-label">Categoría</InputLabel>
                        <Select
                            labelId="edit-category-label"
                            value={editCategory}
                            label="Categoría"
                            onChange={(e) => setEditCategory(e.target.value)}
                        >
                            {categoriasSelect.map((categoria) => (
                                <MenuItem key={categoria.intModuleId} value={categoria.intModuleId}>
                                    {categoria.strModuleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Título"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Leyenda"
                            value={editLegend}
                            onChange={(e) => setEditLegend(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="URL"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => setEditConfirmOpen(true)}>
                        Guardar
                    </Button>
                    <ConfirmationModal
                        open={editConfirmOpen}
                        onClose={() => setEditConfirmOpen(false)}
                        onConfirm={handleConfirmEdit}
                        disableEnforceFocus
                    />
                </DialogActions>
            </Dialog>
            <LoadingOverlay isLoading={isLoading} />
        </>
    );
};
