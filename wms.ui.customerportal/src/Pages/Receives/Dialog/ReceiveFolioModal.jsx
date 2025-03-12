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
const ReceiveFolio = ({ open, onClose, data, handleOpenSKUInfoModal }) => {
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
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}>
            <DialogTitle>
				Folio: {data?.[0]?.strReceinvingFolio || "Sin información"}
			</DialogTitle>
            <DialogContent>
                {data ? (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left' sx={{color: 'white'}}>Receving Folio #</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Date and Time</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>SKU</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Supplier</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Qty received Pieces</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Status</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>OSD</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Trailer Folio #</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedData.map((row, index) => (
									<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
										<TableCell align='left'>{row.strReceinvingFolio}</TableCell>
										<TableCell align='right'>{row.strdtmDate}</TableCell>
										<TableCell align='left' onClick={() => handleOpenSKUInfoModal(row.strReceinvingFolio, row.strSKU)}>
											<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
												{row.strSKU}
											</Typography>
										</TableCell>
										<TableCell align='left'>{row.strSupplierName}</TableCell>
										<TableCell align='left'>{row.strWayofShipping}</TableCell>
										<TableCell align='right'>{row.strQtyPalletsBox}</TableCell>
										{typeof row.intQtyreceivedPieces === 'number' ? (
											<TableCell align="right">{row.intQtyreceivedPieces.toLocaleString('en-US')}</TableCell>
										) : (
											<TableCell align="right">{row.intQtyreceivedPieces}</TableCell>
										)}
										<TableCell align='right'>{row.strStatus}</TableCell>
										<TableCell align='left' onClick={() => handleOpenSKUInfoModal(row.strReceinvingFolio, row.strSKU)}>
											<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
												{row.strOSD}
											</Typography>
										</TableCell>
										<TableCell align="left">
											<Link to={`/CUSTOMERBKEND/YardSummary/TrailerFolioHistory/${row.strTrailerFolio}`} >
												{row.strTrailerFolio}
											</Link>
										</TableCell>
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

export default ReceiveFolio;
