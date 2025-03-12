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
        bgcolor: 'gray',
        Padding: '0'
    }
};

const SKUOnHandModal = ({ open, onClose, data, selectedRowData}) => {
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
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '60%', maxWidth: '60%' } }}>
            <DialogTitle>
                {selectedRowData?.strSKUEndCustomer
                ? `SKU End Customer: ${selectedRowData.strSKUEndCustomer}`
                : "Sin Información"}
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label='simple table'>
						<TableHead>
							<TableRow sx={GridStyle.head}>
                                <TableCell align='left'>Receiving Date</TableCell>
                                <TableCell align='left'>Supplier</TableCell>
                                <TableCell align='left'>Qty</TableCell>
                                <TableCell align='right'>UOM</TableCell>
                                <TableCell align='right'>Pallets</TableCell>
                                <TableCell align='right'>Boxes x Pallet</TableCell>
                                <TableCell align='right'>Pieces x Box</TableCell>
                            </TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
									<TableCell align='left'>{row.strdtmreceive}</TableCell>
                                    <TableCell align='left'>{row.strSupplierName}</TableCell>
                                    <TableCell align='left'>{row.intQty}</TableCell>
                                    <TableCell align='right'>{row.strShipUOMInv}</TableCell>
                                    <TableCell align='right'>{row.intPallets}</TableCell>
                                    <TableCell align='right'>{row.intBoxesxPallets}</TableCell>
                                    <TableCell align='right'>{row.intPiecesxBox}</TableCell>
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

export default SKUOnHandModal;
