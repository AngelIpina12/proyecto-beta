import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, TablePagination, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { ShippingAPI } from '@/services/ShippingAPI';
import dayjs from 'dayjs';
import { getTokenInfo } from '../../utils';
import DocsAndPhotosModal from './Dialog/DocsAndPhotosModal';
import ShippingFolioModal from './Dialog/ShippingFolioModal';

export const ShippingSearchGrid = ({ statusValueToday, updateStatusValueToday }) => {
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [idUser, setIdUser] = useState('');
    const [requirementFolio, setRequirementFolio] = useState('');
    const [requirementFolioError, setRequirementFolioError] = useState('');
    const [shippingFolio, setShippingFolio] = useState('');
    const [shippingFolioError, setShippingFolioError] = useState('');
    const [endCustomer, setEndCustomer] = useState('');
    const [endCustomerError, setEndCustomerError] = useState('');
    const [trailerNumber, setTrailerNumber] = useState('');
    const [trailerNumberError, setTrailerNumberError] = useState('');
    const [skuEndCustomer, setSkuEndCustoer] = useState('');
    const [skuEndCustomerError, setSkuEndCustoerError] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [startDateError, setStartDateError] = useState('')
    const [endDate, setEndDate] = useState(dayjs());
    const [endDateError, setEndDateError] = useState('')
    const [shippingData, setShippingData] = useState([]);
    const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openShippingFolioModal, setOpenShippingFolioModal] = useState(false);
    const [selectedRowShippingFolio, setSelectedRowShippingFolio] = useState(null);
    const [openDocsAndPhotosModal, setOpenDocsAndPhotosModal] = useState(false);
    const [selectedRowDocsPhotosFolio, setSelectedRowDocsPhotosFolio] = useState(null);

    useEffect(() => {
        const ldata = getTokenInfo();
        let lintid = ldata.nameid;
        setIdUser(lintid);
    }, []);

    useEffect(() => {
        if (idUser) {
            const fetchData = async () => {
                try {
                    const response = await ShippingAPI.GetShipTodayDetail(idUser);
                    setShippingData(response.data);
                } catch (error) {
                    console.log('Error fetching data: ', error);
                }
            };
            fetchData();
        }
    }, [idUser]);

    useEffect(() => {
        setRequirementFolio('');
        setEndCustomer('');
        setTrailerNumber('');
        setSkuEndCustoer('');
        setStartDate(null);
        setEndDate(null);
        setShippingData([]);
    }, [selectedFilter]);
    
    useEffect(()=>{
        const fetchData = async () => {
			try{
				const filters = {
					intUserId: idUser,
					strShipFolio: shippingFolio,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ShippingAPI.GetShipDetailByShipFolio(filters);
				setShippingData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		if(!shippingFolio || shippingFolio.length < 3){
			setShippingFolioError('Se necesitan la menos 3 caracteres');
		} else if(!startDate || !endDate){
            setShippingFolioError('');
			if(!startDate)
                setStartDateError('La fecha es obligatoria')
            else
                setEndDateError('La fecha es obligatoria')
		} else {
            setStartDateError('');
            setEndDateError('')
			setShippingFolioError('');
			fetchData();
		}
    }, [shippingFolio, startDate, endDate]);

    useEffect(()=>{
        const fetchData = async () => {
			try{
				const filters = {
					intUserId: idUser,
					strReqFolio: requirementFolio,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ShippingAPI.GetShipDetailByReqFolio(filters);
				setShippingData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		if(!requirementFolio || requirementFolio.length < 3){
			setRequirementFolioError('Se necesitan la menos 3 caracteres');
		} else if(!startDate || !endDate){
            setRequirementFolioError('');
			if(!startDate)
                setStartDateError('La fecha es obligatoria')
            else
                setEndDateError('La fecha es obligatoria')
		} else {
            setStartDateError('');
            setEndDateError('')
			setRequirementFolioError('');
			fetchData();
		}
    }, [requirementFolio, startDate, endDate]);

    useEffect(()=>{
        const fetchData = async () => {
			try{
				const filters = {
					intUserId: idUser,
					strEndCustomer: endCustomer,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ShippingAPI.GetShipDetailByEndCustomer(filters);
				setShippingData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		if(!endCustomer || endCustomer.length < 3){
			setEndCustomerError('Se necesitan la menos 3 caracteres');
		} else if(!startDate || !endDate){
            setEndCustomerError('');
			if(!startDate)
                setStartDateError('La fecha es obligatoria')
            else
                setEndDateError('La fecha es obligatoria')
		} else {
            setStartDateError('');
            setEndDateError('')
            setEndCustomerError('');
			fetchData();
        }
    }, [endCustomer, startDate, endDate]);

    useEffect(()=>{
        const fetchData = async () => {
			try{
				const filters = {
					intUserId: idUser,
					strTrailerN: trailerNumber,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ShippingAPI.GetShipDetailByTrailerN(filters);
				setShippingData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		if(!trailerNumber || trailerNumber.length < 3){
			setTrailerNumberError('Se necesitan la menos 3 caracteres');
		} else if(!startDate || !endDate){
            setEndCustomerError('');
			if(!startDate)
                setStartDateError('La fecha es obligatoria')
            else
                setEndDateError('La fecha es obligatoria')
		} else {
            setStartDateError('');
            setEndDateError('')
			setTrailerNumberError('');
			fetchData();
		}
    }, [trailerNumber, startDate, endDate]);

    useEffect(()=>{
        const fetchData = async () => {
			try{
				const filters = {
					intUserId: idUser,
					strSKUEndCust: skuEndCustomer,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ShippingAPI.GetShipByEndSKuCustom(filters);
				setShippingData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		if(!skuEndCustomer || skuEndCustomer.length < 3){
			setSkuEndCustoerError('Se necesitan la menos 3 caracteres');
		} else if(!startDate || !endDate){
            setEndCustomerError('');
			if(!startDate)
                setStartDateError('La fecha es obligatoria')
            else
                setEndDateError('La fecha es obligatoria')
		} else {
            setStartDateError('');
            setEndDateError('')
			setSkuEndCustoerError('');
			fetchData();
		}
    }, [skuEndCustomer, startDate, endDate]);

    const handleFilterClick = async (event) => {
        setSelectedFilter(event.target.value);  
    };

    const handleOpenShippingFolioModal = async (row) => {
		try{
			setSelectedRowShippingFolio(row);
			setOpenShippingFolioModal(true);
		}catch(error){
			console.log('Error linking data: ', error);
		}
	};

    const handleOpenDocsAndPhotosModal = async (row) => {
		try{
			setSelectedRowDocsPhotosFolio(row);
			setOpenDocsAndPhotosModal(true);
		}catch(error){
			console.log('Error linking data: ', error);
		}
	};

    const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

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

    const renderInputs = () => {
        switch (selectedFilter) {
            case 0:
                // Sin parametros
                return null;
            case 1:
                // Busqueda por Shipping Folio
                return(
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3 }}
                        >
                            <TextField 
                                label="Shipping Folio"
                                value={shippingFolio}
                                onChange={(event) => setShippingFolio(event.target.value)}
                                error={!!shippingFolioError}
                                helperText={shippingFolioError}
                            />
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                format="DD/MM/YYYY"
                                error={!!startDateError}
                                helperText={startDateError}
                                textField={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate}
                                error={!!endDateError}
                                helperText={endDateError}
                                format='DD/MM/YYYY'
                                textField={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>
                );
            case 2:
                // Busqueda por Requirement Folio
                return(
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3 }}
                        >
                            <TextField 
                                label="Requirement Folio"
                                value={requirementFolio}
                                onChange={(event) => setRequirementFolio(event.target.value)}
                                error={!!requirementFolioError}
                                helperText={requirementFolioError}
                            />
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                format="DD/MM/YYYY"
                                error={!!startDateError}
                                helperText={startDateError}
                                textField={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate}
                                error={!!endDateError}
                                helperText={endDateError}
                                format='DD/MM/YYYY'
                                textField={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>
                );
            case 3:
                // Busqueda por End Customer
                return(
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3 }}
                        >
                            <TextField 
                                label="End Customer"
                                value={endCustomer}
                                onChange={(event) => setEndCustomer(event.target.value)}
                                error={!!endCustomerError}
                                helperText={endCustomerError}
                            />
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                format="DD/MM/YYYY"
                                textField={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate}
                                format='DD/MM/YYYY'
                                textField={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>
                );
            case 4:
                // Busqueda por Trailer Number
                return(
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3 }}
                        >
                            <TextField 
                                label="Trailer #"
                                value={trailerNumber}
                                onChange={(event) => setTrailerNumber(event.target.value)}
                                error={!!trailerNumberError}
                                helperText={trailerNumberError}
                            />
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                format="DD/MM/YYYY"
                                textField={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate}
                                format='DD/MM/YYYY'
                                textField={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>
                );
            case 5:
                // Busqueda por SKU EndCustomer
                return(
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3 }}
                        >
                            <TextField 
                                label="SKU"
                                value={skuEndCustomer}
                                onChange={(event) => setSkuEndCustoer(event.target.value)}
                                error={!!skuEndCustomerError}
                                helperText={skuEndCustomerError}
                            />
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                format="DD/MM/YYYY"
                                textField={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate}
                                format='DD/MM/YYYY'
                                textField={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>
                );
            default:
                return null;
        }
    }

    const renderTable = () => {
        const paginatedData = shippingData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        switch (selectedFilter) {
            case 0: //Busqueda por default
            case 1: //Busqueda por Shipping Folio
            case 2: //Busqueda por Requirement Folio
            case 3: //Busqueda por EndCustomer
                return(
                    <TableContainer >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow sx={GridStyle.head}>
                                    <TableCell rowSpan={2} sx={{ color: 'white' }}>Trailer Folio #</TableCell>
                                    <TableCell align='right' rowSpan={2} sx={{ color: 'white' }}>Date and Time Shipped</TableCell>
                                    <TableCell rowSpan={1} colSpan={2} sx={{ color: 'white' }} align='center' >Requirement</TableCell>
                                    <TableCell rowSpan={2} sx={{ color: 'white' }}>Shipping Folio</TableCell>
                                    <TableCell rowSpan={2} sx={{ color: 'white' }}>Seal #</TableCell>
                                    <TableCell rowSpan={2} sx={{ color: 'white' }}>Photos and Docs</TableCell>
                                </TableRow>
                                <TableRow sx={GridStyle.head}>
                                    <TableCell sx={{ color: 'white' }}>CQ Folio</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Customer Folio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    paginatedData.map((row, index) => (
                                        <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                                            <TableCell align="left">{row.strTrailerFolio}</TableCell>
                                            <TableCell align="right">{row.strShippedDate}</TableCell>
                                            <TableCell align="left">{row.strCQFolio}</TableCell>
                                            <TableCell align="left">{row.strCustomerfolio}</TableCell>
                                            <TableCell align='left' onClick={() => handleOpenShippingFolioModal(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.strShipFolio}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">{row.strSeal}</TableCell>
                                            <TableCell align='left' onClick={() => handleOpenDocsAndPhotosModal(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    Photos and Docs
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <ShippingFolioModal open={openShippingFolioModal} onClose={() => setOpenShippingFolioModal(false)} selectedRow={selectedRowShippingFolio} />
                        <DocsAndPhotosModal open={openDocsAndPhotosModal} onClose={() => setOpenDocsAndPhotosModal(false)} selectedRow={selectedRowDocsPhotosFolio} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={shippingData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </TableContainer>
                  );
            case 4: //Busqueda por Trailer Number
                return(
                    <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow sx={GridStyle.head}>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Trailer #</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Trailer Folio #</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Date and Time Shipped</TableCell>
                                <TableCell rowSpan={1} colSpan={2} sx={{ color: 'white' }} align='center' >Requirement</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Shipping Folio</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Seal #</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Photos and Docs</TableCell>
                            </TableRow>
                            <TableRow sx={GridStyle.head}>
                                <TableCell sx={{ color: 'white' }}>CQ Folio</TableCell>
                                <TableCell sx={{ color: 'white' }}>Customer Folio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {
                                    paginatedData.map((row, index) => (
                                        <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                                            <TableCell align="left">{row.strTrailerNumber}</TableCell>
                                            <TableCell align="left">{row.strTrailerFolio}</TableCell>
                                            <TableCell align="right">{row.strShippedDate}</TableCell>
                                            <TableCell align="left">{row.strCQFolio}</TableCell>
                                            <TableCell align="left">{row.strCustomerfolio}</TableCell>
                                            <TableCell align='left' onClick={() => handleOpenShippingFolioModal(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.strShipFolio}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">{row.strSeal}</TableCell>
                                            <TableCell align='left' onClick={() => handleOpenDocsAndPhotosModal(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    Photos and Docs
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <ShippingFolioModal open={openShippingFolioModal} onClose={() => setOpenShippingFolioModal(false)} selectedRow={selectedRowShippingFolio} />
                        <DocsAndPhotosModal open={openDocsAndPhotosModal} onClose={() => setOpenDocsAndPhotosModal(false)} selectedRow={selectedRowDocsPhotosFolio} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={shippingData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </TableContainer>
                );
            case 5: //Busqueda por SKU EndCustomer
                return(
                    <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow sx={GridStyle.head}>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>SKU</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Trailer Folio #</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Trailer #</TableCell>
                                <TableCell align="right" rowSpan={2} sx={{ color: 'white' }}>Date and Time Shipped</TableCell>
                                <TableCell rowSpan={1} colSpan={2} sx={{ color: 'white' }} align='center' >Requirement</TableCell>
                                <TableCell align="right" rowSpan={2} sx={{ color: 'white' }}>Quantity Pieces</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Shipping Folio</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Seal #</TableCell>
                                <TableCell rowSpan={2} sx={{ color: 'white' }}>Photos and Docs</TableCell>
                            </TableRow>
                            <TableRow sx={GridStyle.head}>
                                <TableCell sx={{ color: 'white' }}>CQ Folio</TableCell>
                                <TableCell sx={{ color: 'white' }}>Customer Folio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {
                                    paginatedData.map((row, index) => (
                                        <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                                            <TableCell align="left">{row.strSKUEnd}</TableCell>
                                            <TableCell align="left">{row.strTrailerFolio}</TableCell>
                                            <TableCell align="left">{row.strTrailerNumber}</TableCell>
                                            <TableCell align="right">{row.strShippedDate}</TableCell>
                                            <TableCell align="left">{row.strCQFolio}</TableCell>
                                            <TableCell align="left">{row.strCustomerfolio}</TableCell>
                                                {typeof row.intPieces === 'number' ? (
                                                    <TableCell align="right">{row.intPieces.toLocaleString('en-US')}</TableCell>
                                                ) : (
                                                    <TableCell align="right">{row.intPieces}</TableCell>
                                                )}
                                            <TableCell align='left' onClick={() => handleOpenShippingFolioModal(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.strShipFolio}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">{row.strSeal}</TableCell>
                                            <TableCell align='left' onClick={() => handleOpenDocsAndPhotosModal(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    Photos and Docs
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <ShippingFolioModal open={openShippingFolioModal} onClose={() => setOpenShippingFolioModal(false)} selectedRow={selectedRowShippingFolio} />
                        <DocsAndPhotosModal open={openDocsAndPhotosModal} onClose={() => setOpenDocsAndPhotosModal(false)} selectedRow={selectedRowDocsPhotosFolio} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={shippingData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </TableContainer>
                );
        }
    }

    return(
        <Grid container spacing={3} >
            <Grid item container spacing={3}>
                <Grid item >
                    <Box sx={{ display: 'flex', justifyContent: 'start', mt: 3 }}>
                        <Select
                        value={selectedFilter}
                        defaultValue={0}
                        label="Filter"
                        onChange={handleFilterClick}
                        sx={{ width: 200 }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    '& .MuiListSubheader-root': {
                                        backgroundColor: '#f0f0f0', 
                                    },
                                },
                            },
                        }}
                        >
                            <MenuItem value={0} disabled>Select a filter</MenuItem>
                            <MenuItem value={1}>Shipping Folio</MenuItem>
                            <MenuItem value={2}>Requierement Folio</MenuItem>
                            <MenuItem value={3}>End Customer</MenuItem>
                            <MenuItem value={4}>Trailer #</MenuItem>
                            <MenuItem value={5}>SKU End Customer</MenuItem>
                        </Select>
                    </Box>
                </Grid>
                <Grid item >
                    <Box sx={{ display: 'flex', justifyContent: 'start', mt: 3 }}>
                        {renderInputs()}
                    </Box>
                </Grid>
            </Grid>
            <Grid item>
                {renderTable()}
            </Grid>
        </Grid>
    )
}