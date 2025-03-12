import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TablePagination } from '../../../components/Global/TablePagination';

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

const ShipmentsPackingListModal = ({ open, onClose, data }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => { setPage(newPage) };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        onClose(); 
        setTimeout(() => { setPage(0) }, 1000) 
    };

    const paginatedData = data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    return (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}>
            <DialogTitle>
                Packing List
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    sx={{ position: 'absolute', right: 18, top: 8, padding: '8px' }}
                ><CloseIcon  />
                </IconButton>
			</DialogTitle>
            <DialogContent>
                {data ? (
                    <>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow sx={GridStyle.head}>
                                        <TableCell align='left' sx={{ color: 'white' }}>SKU</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Description</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Etiq Master</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Lot</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>PO</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Release</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Transport Line</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Quality Status</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Date</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Requirement Folio</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Way of Shipping</TableCell>
                                        <TableCell align='left' sx={{ color: 'white' }}>Shipped Qty</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((row, index) => (
                                        <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                                            <TableCell align='left'>{row.strSKU}</TableCell>
                                            <TableCell align='left'>{row.strDescription}</TableCell>
                                            <TableCell align='left'>{row.strEtiqMaster}</TableCell>
                                            <TableCell align='left'></TableCell>
                                            <TableCell align='left'></TableCell>
                                            <TableCell align='left'></TableCell>
                                            <TableCell align='left'>{row.strTransportLine}</TableCell>
                                            <TableCell align='left'>{row.strQualityStatus}</TableCell>
                                            <TableCell align='left'>{row.strDate}</TableCell>
                                            <TableCell align='left'>{row.strRequirementFolio}</TableCell>
                                            <TableCell align='left'>{row.strWayOfShipping}</TableCell>
                                            <TableCell align='left'>{row.strShippedQty}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            page={page}
                            rowsPerPage={rowsPerPage}
                            count={data.length}
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
        </Dialog>
    );
};

export default ShipmentsPackingListModal;
