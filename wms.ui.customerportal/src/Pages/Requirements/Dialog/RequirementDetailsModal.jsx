import React, { useState } from 'react';

import {
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    CircularProgress, 
    Table, 
    TableContainer, 
    TablePagination,
	TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Typography, 
    IconButton,
    Box
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import CustomAlert from '../../../components/Global/CustomAlert'
;
import { InventoryAPI } from '@/services/InventoryAPI';
import { ShipmentsAPI } from '@/services/ShipmentsAPI';
import SKUNotAllocatedModal from '../../Inventory/Dialog/SKUNotAllocated';
import ShipmentsPackingListModal from '../../Shipments/Dialog/ShipmentsPackingListModal';


const RequirementDetails = ({ open, onClose, data, selectedRowData, idUserState }) => {
    // Hooks
    const [detailsData, setDetailsData] = useState([]);
    const [openSKUNotAllocatedModal, setOpenSKUNotAllocatedModal] = useState(false);
    const [selectedDetailRowData, setSelectedDetailRowData] = useState(null);
    const [packingListData, setPackingListData] = useState([]);
    const [openPackingListModal, setOpenPackingListModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    
    // Cuando se le da click a la celda de qty not allocated
    const handleQtyNotAllocated = async(row) => {
        try {
            const filters = {
                intUserId: idUserState,
                intInvId: row.intInventoryId,
                strSKU: row.strSKUEndCustomer
            };
            const response = await InventoryAPI.GetSKUNOTAllocated(filters);
            setDetailsData(response.data);
            setSelectedDetailRowData({
                strSKUEndCustomer: row.strSKUEndCustomer
            });
            setOpenSKUNotAllocatedModal(true);
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    }
    
    // Cuando se le da click a la celda de qty shipped
    const handlePackingList = async(row) => {
        if (row.decQtyShipped === null || row.decQtyShipped === 0 || row.decQtyShipped === "") {
            setAlert({ open: true, message: "No hay ningún qty shipped para poder revisar el package list.", severity: 'warning' });
            return;
        }
        try {
            const response = await ShipmentsAPI.GetListShipmentDetails(row.intShipmentId);
            setPackingListData(response.data);
            setOpenPackingListModal(true);
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    };

    // Cuando se cierra el modal
    const handleClose = () => {
        onClose(); 
        setTimeout(() => { setPage(0) }, 1000) 
    };
    
    // Cuando se cierra el alert
    const handleCloseAlert = () => { setAlert((prev) => ({ ...prev, open: false })) };
    
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
    const paginatedData = data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
    
    return (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {selectedRowData ? (
                            <>
                                <span>Requerimiento: {selectedRowData.strCQFolio}</span>
                                <span style={{ marginLeft: '200px' }}>Date Required: {selectedRowData.strAllocationDate}</span>
                                <span style={{ marginLeft: '200px' }}>% de Avance: {selectedRowData.decProgress}</span>
                            </>
                        ) : (
                            "Detalles del requerimiento"
                        )}
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        sx={{ padding: '8px' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow sx={GridStyle.head}>
                                        <TableCell align='left' sx={{ color: 'white' }}>SKU End Customer</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>UOM</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Qty Required</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Qty Allocated</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Qty Not Allocated</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Qty Pickeds</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Qty Shipped</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((row, index) => (
                                        <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                                            <TableCell align='left'>{row.strSKUEndCustomer}</TableCell>
                                            <TableCell align='left'>{row.strUOM}</TableCell>
                                            <TableCell align='left'>{row.decQtyRequired}</TableCell>
                                            <TableCell align='left'>{row.decQtyAllocated}</TableCell>
                                            <TableCell align='left' onClick={() => handleQtyNotAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.decQtyNotAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>{row.intQtyPickeds}</TableCell>
                                            <TableCell align='left' onClick={() => handlePackingList(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.decQtyShipped}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={detailsData} selectedRowData={selectedDetailRowData} />
                        <ShipmentsPackingListModal open={openPackingListModal} onClose={() => setOpenPackingListModal(false)} data={packingListData} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                ) : (
                    <CircularProgress />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
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

export default RequirementDetails;
