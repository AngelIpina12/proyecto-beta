import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Table, TableContainer, TablePagination, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

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
const ShippingFolioModal = ({ open, onClose, selectedRow }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}>
            <DialogTitle>
                Shipping Folio
            </DialogTitle>
            <DialogContent>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShippingFolioModal;