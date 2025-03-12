import React from 'react';
import { Box, IconButton, TablePagination as MuiTablePagination } from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';

export const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const handleFirstPage = (event) => {
    onPageChange(event, 0);
  };

  const handleLastPage = (event) => {
    onPageChange(event, Math.ceil(count / rowsPerPage) - 1);
  };

  const handleNextPage = (event) => {
    onPageChange(event, page + 1);
  };

  const handlePreviousPage = (event) => {
    onPageChange(event, page - 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2, display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleFirstPage} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handlePreviousPage} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextPage}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPage}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};

export const TablePagination = ({ page, rowsPerPage, count, onPageChange, onRowsPerPageChange }) => {
  return (
    <MuiTablePagination
      rowsPerPageOptions={[5, 10, 15]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      ActionsComponent={TablePaginationActions}
    />
  );
};
