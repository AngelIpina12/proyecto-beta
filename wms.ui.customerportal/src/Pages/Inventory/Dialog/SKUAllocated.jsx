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
const SKUAllocatedModal = ({ open, onClose, data}) => {
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
                {data?.[0]?.strSKU && data?.[0]?.strUOM && data?.[0]?.strWayShipping
                ? `SKU: ${data?.[0]?.strSKU} \t\t UOM: ${data?.[0]?.strUOM} \t\t Way Of Shipping: UOM: ${data?.[0]?.strWayShipping}`
                : "Sin Información"}
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label='simple table'>
						<TableHead>
							<TableRow sx={GridStyle.head}>
                                <TableCell rowSpan={2} align='right'>Allocation Date</TableCell>
                                <TableCell colSpan={2} align='center'>Requirement</TableCell>
                                <TableCell rowSpan={2} align='right'>Qty Requested</TableCell>
                                <TableCell rowSpan={2} >QA Status</TableCell>
                                <TableCell rowSpan={2} >Status</TableCell>
                            </TableRow>
                            <TableRow sx={GridStyle.head}>
                                <TableCell align='left'>CQ Folio</TableCell>
                                <TableCell align='left'>Customer Folio</TableCell>
                            </TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((row, index) => (
								<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
									<TableCell align='right'>{row.stDtmAlloc}</TableCell>
                                    <TableCell align='left'>{row.strCQFolio}</TableCell>
                                    <TableCell align='left'>{row.intCustFolio}</TableCell>
                                    <TableCell align='right'>{row.intQtyReq}</TableCell>
                                    <TableCell align='left'>{row.strinvquality}</TableCell>
                                    <TableCell align='left'>{row.strReqStatus}</TableCell>
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

export default SKUAllocatedModal;
