import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Table, TableContainer, TablePagination, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from "react-router-dom";

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
const SKUInfoModal = ({ open, onClose, data }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = data ? data.detailInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}>
            <DialogTitle>
                {data?.headInfo?.strReceinvingFolio && data?.detailInfo?.[0]?.strSKU
                ? `Folio: ${data.headInfo.strReceinvingFolio} - SKU: ${data.detailInfo[0].strSKU}`
                : "Sin Información"}
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label='simple table'>
						<TableHead>
							<TableRow sx={GridStyle.head}>
								<TableCell align='left' sx={{color: 'white'}}>SKU</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>Supplier</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
								<TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
								<TableCell align='right' sx={{color: 'white'}}>Qty received Pieces</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>Fotos</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>Packing List</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
									<TableCell align='left'>{row.strSKU}</TableCell>
                                    <TableCell align='left'>{row.strSupplierName}</TableCell>
                                    <TableCell align='left'>{row.strWayofShipping}</TableCell>
                                    <TableCell align='right'>{row.strQtyPalletsBox}</TableCell>
                                    <TableCell align='right'>{row.strQtyreceivedPieces}</TableCell>
                                    <TableCell align='left'>Fotos</TableCell>
                                    <TableCell align='left'>Packing List</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={data.detailInfo.length}
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

export default SKUInfoModal;
