import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Table, TableContainer, TablePagination, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

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
const SKUInProcessOfWOModal = ({ open, onClose, data, selectedRowData }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: '80%' } }}>
            <DialogTitle>
                {selectedRowData?.strSKUEndCustomer ? `SKU in Process of WO (type) - ${selectedRowData?.strSKUEndCustomer}` : "Sin Información"}
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label='simple table'>
						<TableHead>
							<TableRow sx={GridStyle.head}>
								<TableCell align='left' sx={{color: 'white'}}>WO #</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>Type of WO</TableCell>
								<TableCell align='right' sx={{color: 'white'}}>Date and Time Start</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>SKU End Customer</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>SKU Supplier</TableCell>
								<TableCell align='right' sx={{color: 'white'}}>Total Pieces</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>UOM</TableCell>
                                <TableCell align='left' sx={{color: 'white'}}>Final SKU</TableCell>
                                <TableCell align='right' sx={{color: 'white'}}>Quantity of Final SKU in Process</TableCell>
                                <TableCell align='right' sx={{color: 'white'}}>Quantity of Pieces Scrapped</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
									<TableCell align='left'>{row.intWorOrderId}</TableCell>
                                    <TableCell align='left'>{row.strWorkType}</TableCell>
                                    <TableCell align='right'>{row.strdtmStart}</TableCell>
                                    <TableCell align='left'>{row.strSKUEndCustomer}</TableCell>
                                    <TableCell align='left'>{row.strSKUSupplier}</TableCell>
                                    <TableCell align='right'>{row.intTotalPieces}</TableCell>
                                    <TableCell align='left'>{row.strUOM}</TableCell>
                                    <TableCell align='left'>{row.strFinalSKU}</TableCell>
                                    <TableCell align='right'>{row.intQtyFSKUProcees}</TableCell>
                                    <TableCell align='right'>{row.intQtyPiecesScrap}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
                ) : (
                    <CircularProgress />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SKUInProcessOfWOModal;
