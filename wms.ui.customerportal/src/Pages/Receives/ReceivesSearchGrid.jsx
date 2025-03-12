import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TablePagination, Button, Stack, Autocomplete, CircularProgress } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import ReceiveFolioModal from './Dialog/ReceiveFolioModal';
import SKUInfoModal from './Dialog/SKUInfoModal';
import { ReceiveAPI } from '@/services/ReceiveAPI';
import { userAPI } from '@/services/userAPI';
import { CatalogoAPI } from '@/services/CatalogoAPI';
import dayjs from 'dayjs';
import { getTokenInfo } from '../../utils';

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

export const ReceivesSearchGrid = () => {
	const [Iduserstate, setIduserstate] = useState('');
	const [customerId, setCustomerId] = useState(-1);
	const [selectedFilter, setSelectedFilter] = useState(0);
	const [folioNumber, setFolioNumber] = useState('');
	const [folioNumberError, setFolioNumberError] = useState('');
	const [endCustomer, setEndCustomer] = useState('');
	const [endCustomerError, setEndCustomerError] = useState('');
	const [endCustomerOptions, setEndCustomerOptions] = useState([]);
	const [startDate, setStartDate] = useState(dayjs());
	const [justStartDate, setJustStartDate] = useState(dayjs());
  	const [endDate, setEndDate] = useState(dayjs());
	const [justEndDate, setJustEndDate] = useState(dayjs());
	const [sku, setSku] = useState('');
	const [skuError, setSkuError] = useState('');
	const [skuOptions, setSkuOptions] = useState([]);
	const [supplier, setSupplier] = useState('');
	const [supplierError, setSupplierError] = useState('');
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [receiveListData, setReceiveListData] = useState([]);
	const [receiveFolioData, setReceiveFolioData] = useState(null);
    const [openReceiveFolio, setOpenReceiveFolio] = useState(false);
	const [skuInfoData, setSkuInfoData] = useState(null);
    const [openSkuInfoModal, setOpenSkuInfoModal] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState(false);

	useEffect(() => { //Obtiene el UserId
        const ldata = getTokenInfo();
        let lintid = ldata.nameid;
        setIduserstate(lintid);
    }, []);

	useEffect(() => { //Consulta por defecto cuando ya consiguió el UserId
        if (Iduserstate) {
            const fetchData = async () => {
                try {
                    const response = await ReceiveAPI.TodayReceiveList(Iduserstate);
                    setReceiveListData(response.data);
                } catch (error) {
                    console.log('Error fetching data: ', error);
                }
            };
            const fetchCustomerId = async () => {
                try {
                    const filters = { UserId: Iduserstate, UserName: "", PWD: "", Type: "" }
                    const response = await userAPI.getUserInfo2(filters);
                    setCustomerId(response.data[0].customerId);
                } catch (error) {
                    console.log('Error fetching data: ', error);
                }
            }
            fetchData();
            fetchCustomerId();
        }
    }, [Iduserstate]);

	useEffect(() => { // Consultar el autocompletado de EndCustomer
		if(!endCustomer || endCustomer === '' ){
			setEndCustomerOptions([]);
			return;
		}
		else if(endCustomer.length < 3){
			setEndCustomerError('Se necesitan al menos 3 caracteres')
			setEndCustomerOptions([]);
			return;
		} else{
			setEndCustomerError('')
			setLoading(true);
			const fetchData = async () => {
				try{
					const filters = {
						strName: endCustomer,
						intUserId: Iduserstate,
					};
					const response = await CatalogoAPI.GetEndCustomer(filters);
					setEndCustomerOptions(response.data);
				} catch(error){
					console.log('Error fetching data: ', error)
				} finally {
					setLoading(false);
				}
			};
			const debounceTimeout = setTimeout(() => {
				fetchData();
			}, 300);
			return () => clearTimeout(debounceTimeout);
		}
	}, [endCustomer]);

	useEffect(() => { // Consultar el autocompletado de SKU
		if(!sku || sku === '' ){
			setSkuError('');
			setSkuOptions([]);
			return;
		}
		else if(sku.length < 3){
			setSkuError('Se necesitan al menos 3 caracteres')
			setSkuOptions([]);
			return;
		}
		else{
			setSkuError('')
			setLoading(true);
			const fetchData = async () => {
				try{
					const filters = {
						strName: sku,
						customerId: customerId,
					};
					const response = await CatalogoAPI.GetProductSKUCustom(filters);
					setSkuOptions(response.data);
				} catch(error){
					console.log('Error fetching data: ', error)
				} finally {
					setLoading(false);
				}
			};
			const debounceTimeout = setTimeout(() => {
				fetchData();
			}, 300);
			return () => clearTimeout(debounceTimeout);
		}
	}, [sku]);

	useEffect(() => { // Consultar el autocompletado de Supplier
		if(!supplier || supplier === '' ){
			setSupplierError('');
			setSupplierOptions([]);
			return;
		}
		else if(supplier.length < 2){
			setSupplierError('Se necesitan al menos 2 caracteres')
			setSupplierOptions([]);
			return;
		}
		else{
			setSupplierError('')
			setLoading(true);
			const fetchData = async () => {
				try{
					const filters = { strName: supplier, intUserId: Iduserstate, };
					const response = await CatalogoAPI.GetSupplier(filters);
					setSupplierOptions(response.data);
				} catch(error){
					console.log('Error fetching data: ', error)
				} finally {
					setLoading(false);
				}
			};
			const debounceTimeout = setTimeout(() => {
				fetchData();
			}, 300);
			return () => clearTimeout(debounceTimeout);
		}
	}, [supplier]);

	const handleSearchFolioNumber = () => { // Consulta filtrando por Folio #
		const fetchData = async () => {
			try{
				const response = await ReceiveAPI.GetReceiveListByRecFolio(folioNumber);
				setReceiveListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error);
			}
		};
		fetchData();
	};

	const handleSearchEndCustomer = () => { //Consulta por EndCustomer y fechas
		const fetchData = async () => {
			try{
				const filters = {
					intUserId: Iduserstate,
					intEndCustomerId: null,
					strCustomerName: null,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				if (Number.isInteger(parseInt(endCustomer))) {
					filters.intEndCustomerId = parseInt(endCustomer);
				} else {
					filters.strCustomerName = endCustomer;
					filters.intEndCustomerId = 0;
				}
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ReceiveAPI.GetReceiveListByCustomerDate(filters);
				setReceiveListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		fetchData();
	};

	const handleSearchSKUDates = () => { //Consulta por SKU y fechas
		const fetchData = async () => {
			try{
				const filters = {
					intUserId: Iduserstate,
					strSKU: sku,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ReceiveAPI.GetReceiveListBySKUDate(filters);
				setReceiveListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		fetchData();
	};

	const handleSearchSupplier = () => { // Consulta por Supplier y fechas
		const fetchData = async () => {
			try{
				const filters = {
					intUserId: Iduserstate,
					strSupplierName: supplier,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ReceiveAPI.GetReceiveListBySupplierDate(filters);
				setReceiveListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		fetchData();
	};

	const handleSearchDates = () => { //Consulta por Rango de Fechas
		const fetchData = async () => {
			try{
				const filters = {
					intUserId: Iduserstate,
					dtmStartDate: justStartDate,
					dtmEndDate: justEndDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await ReceiveAPI.GetReceiveListByDate(filters);
				setReceiveListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			}
		};
		if(Iduserstate != null && Iduserstate != '' && justStartDate != null && justEndDate != null){
			fetchData();
		}
	};

	useEffect(() => { // Limpia los filtros
		setFolioNumber('');
		setFolioNumberError('');
		setEndCustomer('');
		setEndCustomerError('');
		setStartDate(null);
    	setEndDate(null);
		setSku('');
		setSupplier('');
		setReceiveListData([]);
	}, [selectedFilter]);
	
	const handleFilterClick = async (event) => {
		setSelectedFilter(event.target.value);  
	};

	const handleOpenReceiveFolioModal = async (id) => {
		try{
			const response = await ReceiveAPI.GetReceiveListByRecFolio(id);
			setReceiveFolioData(response.data);
            setOpenReceiveFolio(true);
		}catch(error){
			console.log('Error fetching data: ', error);
		}
	};

	const handleOpenSKUInfoModal = async (folioId, SKU) => {
		try{
			const filters = {
				strRECFolio: folioId,
				strSKU : SKU
			};
			const response = await ReceiveAPI.GetReceiveSKUAndFolioInfo(filters);
			setSkuInfoData(response.data);
			setOpenSkuInfoModal(true);
		}catch(error){
			console.log('Error fetching data: ', error);
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	
	const renderInputs = () => {
		switch (selectedFilter) {
			case 0:
				return null;
			case 1:
				// Buscar por Folio Number
				return(
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
					<TextField 
						label='Folio #'
						value={folioNumber}
						onChange={(event) => setFolioNumber(event.target.value)}
						error={!!folioNumberError}
                		helperText={folioNumberError}
					/>
					<Button
						variant="contained"
						component="span"
						color="primary"
						onClick={handleSearchFolioNumber}
						sx={{padding: '15px'}}
					>
						<SearchIcon sx={{ color: 'white' }} />
					</Button>
				</Box>)
			case 2:
				// Buscar por EndCustomer
				return(
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
							<Stack spacing={2} sx={{ width: 300 }}>
								<Autocomplete
								id="endCustomerFilter"
								freeSolo
								options={endCustomerOptions}
								getOptionLabel={(option) => option.name || ''}
								filterOptions={(x) => x}
								onInputChange={(event, newInputValue) => setEndCustomer(newInputValue)}
								renderInput={(params) => (
									<TextField
									{...params}
									label="End Customer"
									variant="outlined"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
											{loading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
											</>
										),
									}}
									error={!!endCustomerError}
									helperText={endCustomerError}
									/>
								)}
								/>
							</Stack>
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
							<Button
								variant="contained"
								component="span"
								color="primary"
								onClick={handleSearchEndCustomer}
								sx={{padding: '15px'}}
							>
								<SearchIcon sx={{ color: 'white' }} />
							</Button>
						</Box>
					</LocalizationProvider>)
			case 3:
				// Buscar por SKU
				return(
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
							<Stack spacing={2} sx={{ width: 300 }}>
								<Autocomplete
								id="skuFilter"
								freeSolo
								options={skuOptions}
								getOptionLabel={(option) => option.name || ''}
								filterOptions={(x) => x}
								onInputChange={(event, newInputValue) => setSku(newInputValue)}
								renderInput={(params) => (
									<TextField
									{...params}
									label="SKU"
									variant="outlined"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
											{loading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
											</>
										),
									}}
									error={!!skuError}
									helperText={skuError}
									/>
								)}
								/>
							</Stack>
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
						<Button
							variant="contained"
							component="span"
							color="primary"
							onClick={handleSearchSKUDates}
							sx={{padding: '15px'}}
						>
							<SearchIcon sx={{ color: 'white' }} />
						</Button>
					</Box>
				</LocalizationProvider>)
			case 4:
				// Buscar por Supplier
				return(
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
						<Stack spacing={2} sx={{ width: 300 }}>
								<Autocomplete
								id="supplierFilter"
								freeSolo
								options={supplierOptions}
								getOptionLabel={(option) => option.name || ''}
								filterOptions={(x) => x}
								onInputChange={(event, newInputValue) => setSupplier(newInputValue)}
								renderInput={(params) => (
									<TextField
									{...params}
									label="Supplier"
									variant="outlined"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
											{loading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
											</>
										),
									}}
									error={!!supplierError}
									helperText={supplierError}
									/>
								)}
								/>
							</Stack>
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
						<Button
							variant="contained"
							component="span"
							color="primary"
							onClick={handleSearchSupplier}
							sx={{padding: '15px'}}
						>
							<SearchIcon sx={{ color: 'white' }} />
						</Button>
					</Box>
				</LocalizationProvider>)
			case 5:
				// Buscar por Rango de Fechas
				return(
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box
							sx={{ 
								display: 'flex',
								alignItems: 'flex-start',
								gap: 3 }
							}
						>
						<DatePicker
							label="Start Date"
							value={justStartDate}
							onChange={(newValue) => setJustStartDate(newValue)}
							format="DD/MM/YYYY"
							textField={(params) => <TextField {...params} />}
						/>
						<DatePicker
							label="End Date"
							value={justEndDate}
							onChange={(newValue) => setJustEndDate(newValue)}
							minDate={justStartDate}
							format='DD/MM/YYYY'
							textField={(params) => <TextField {...params} />}
						/>
						<Button
							variant="contained"
							component="span"
							color="primary"
							onClick={handleSearchDates}
							sx={{padding: '15px'}}
						>
							<SearchIcon sx={{ color: 'white' }} />
						</Button>
					</Box>
				</LocalizationProvider>)
			default:
				return null;
		}
	}

	const renderTable = () =>{
		const paginatedData = receiveListData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
		switch (selectedFilter) {
			case 0: 
				//Muestra los registros de hoy, por defecto
				return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='right' sx={{color: 'white'}}>Date and Time</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Receving Folio #</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Trailer Folio #</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									paginatedData.map((row, index) => (
										<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
											<TableCell align="right">{row.strDateTime}</TableCell>
											<TableCell align="left" onClick={() => handleOpenReceiveFolioModal(row.strRecFolio)}>
												<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
														{row.strRecFolio}
												</Typography>
											</TableCell>
											<TableCell align="left">
												<Link to={`/CUSTOMERBKEND/YardSummary/TrailerFolioHistory/${row.strTrailerFolio}`} >
													{row.strTrailerFolio}
												</Link>
											</TableCell>
										</TableRow>
									))
								}
							</TableBody>
						</Table>
						<ReceiveFolioModal open={openReceiveFolio} onClose={() => setOpenReceiveFolio(false)} data={receiveFolioData} handleOpenSKUInfoModal={handleOpenSKUInfoModal}/>
						<SKUInfoModal open={openSkuInfoModal} onClose={() => setOpenSkuInfoModal(false)} data={skuInfoData} />
						<TablePagination
								rowsPerPageOptions={[5, 10, 15]}
								component="div"
								count={receiveListData.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
					</TableContainer>
				)
			case 1:
				//Muestra los registros filtrados por Folio #
				return (
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
										<TableCell align="right">{row.strStatus}</TableCell>
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
						<SKUInfoModal open={openSkuInfoModal} onClose={() => setOpenSkuInfoModal(false)} data={skuInfoData} />
						<TablePagination
							rowsPerPageOptions={[5, 10, 15]}
							component="div"
							count={receiveListData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				)
			case 2:
				//Muestra los registros filtrados por EndCustomer
				return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left'  sx={{color: 'white'}}>End Customer</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Date and Time</TableCell>
									<TableCell align='left'  sx={{color: 'white'}}>Receving Folio #</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Trailer Folio #</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedData.map((row, index) => (
									<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
										<TableCell align='left' >{row.strEndCustomerName}</TableCell>
										<TableCell align='right'>{row.strDateTime}</TableCell>
										<TableCell align="left" onClick={() => handleOpenReceiveFolioModal(row.strRecFolio)}>
											<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
												{row.strRecFolio}
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
						<ReceiveFolioModal open={openReceiveFolio} onClose={() => setOpenReceiveFolio(false)} data={receiveFolioData} handleOpenSKUInfoModal={handleOpenSKUInfoModal}/>
						<SKUInfoModal open={openSkuInfoModal} onClose={() => setOpenSkuInfoModal(false)} data={skuInfoData} />
						<TablePagination
							rowsPerPageOptions={[5, 10, 15]}
							component="div"
							count={receiveListData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				)
			case 3:
				// Muestra los registros filtrados por SKU
				return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left' sx={{color: 'white'}}>Receiving Folio #</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Date and Time</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Trailer Folio #</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedData.map((row, index) => (
									<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
										<TableCell align="left" onClick={() => handleOpenReceiveFolioModal(row.strReceinvingFolio)}>
												<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
														{row.strReceinvingFolio}
												</Typography>
											</TableCell>
										<TableCell align='right'>{row.stringReceivedDate}</TableCell>
										<TableCell align="left">
											<Link to={`/CUSTOMERBKEND/YardSummary/TrailerFolioHistory/${row.strTrailerFolio}`} >
												{row.strTrailerFolio}
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<ReceiveFolioModal open={openReceiveFolio} onClose={() => setOpenReceiveFolio(false)} data={receiveFolioData} handleOpenSKUInfoModal={handleOpenSKUInfoModal}/>
						<SKUInfoModal open={openSkuInfoModal} onClose={() => setOpenSkuInfoModal(false)} data={skuInfoData} />
						<TablePagination
							rowsPerPageOptions={[5, 10, 15]}
							component="div"
							count={receiveListData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				)
			case 4:
				// Muestra los registros filtrados por Supplier
				return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left' sx={{color: 'white'}}>Supplier</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Receving Folio #</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Date and Time</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Trailer Folio #</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
							{paginatedData.map((row, index) => (
									<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
										<TableCell align='left'>{row.strSuppliername}</TableCell>
										<TableCell align="left" onClick={() => handleOpenReceiveFolioModal(row.strReceinvingFolio)}>
											<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
												{row.strReceinvingFolio}
											</Typography>
										</TableCell>
										<TableCell align='right'>{row.strReceivedDate}</TableCell>
										<TableCell align="left">
											<Link to={`/CUSTOMERBKEND/YardSummary/TrailerFolioHistory/${row.strTrailerFolio}`} >
												{row.strTrailerFolio}
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<ReceiveFolioModal open={openReceiveFolio} onClose={() => setOpenReceiveFolio(false)} data={receiveFolioData} handleOpenSKUInfoModal={handleOpenSKUInfoModal}/>
						<SKUInfoModal open={openSkuInfoModal} onClose={() => setOpenSkuInfoModal(false)} data={skuInfoData} />
						<TablePagination
							rowsPerPageOptions={[5, 10, 15]}
							component="div"
							count={receiveListData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				)
			case 5:
				// Muestra los registros filtrados por Rango de Fechas
				return (
					<TableContainer>
					<Table sx={{minWidth: 650}} aria-label='simple table'>
						<TableHead>
							<TableRow sx={GridStyle.head}>
								<TableCell align='left' sx={{color: 'white'}}>Receving Folio #</TableCell>
								<TableCell align='right' sx={{color: 'white'}}>Date and Time</TableCell>
								<TableCell align='left' sx={{color: 'white'}}>Trailer Folio #</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((row, index) => (
									<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
										<TableCell align="left" onClick={() => handleOpenReceiveFolioModal(row.strReceinvingFolio)}>
											<Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
												{row.strReceinvingFolio}
											</Typography>
										</TableCell>
										<TableCell align='right'>{row.stringReceivedDate}</TableCell>
										<TableCell align="left">
											<Link to={`/CUSTOMERBKEND/YardSummary/TrailerFolioHistory/${row.strTrailerFolio}`} >
												{row.strTrailerFolio}
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<ReceiveFolioModal open={openReceiveFolio} onClose={() => setOpenReceiveFolio(false)} data={receiveFolioData} handleOpenSKUInfoModal={handleOpenSKUInfoModal}/>
						<SKUInfoModal open={openSkuInfoModal} onClose={() => setOpenSkuInfoModal(false)} data={skuInfoData} />
						<TablePagination
							rowsPerPageOptions={[5, 10, 15]}
							component="div"
							count={receiveListData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				)
			default:
				return null
		}
	};

	return (
		<Grid container spacing={3} >
			<Grid item container spacing={3}>
				<Grid item >
					<Box sx={{ display: 'flex', justifyContent: 'start', mt: 3 }}>
						<Select 
							value={selectedFilter}
							defaultValue={0}
							label='Filter'
							onChange={handleFilterClick}
							sx={{ width: 200 }}
							MenuProps={{
								PaperProps: {
									sx: {
										'& .MuiListSubheader-root': {
											// Color de fondo diferente para el ListSubheader
											backgroundColor: '#f0f0f0', 
										},
									},
								},
							}
						}>
							<MenuItem value={0} disabled>Select a filter</MenuItem>
							<MenuItem value={1} >Folio #</MenuItem>
							<MenuItem value={2} >End Customer</MenuItem>
							<MenuItem value={3} >SKU</MenuItem>
							<MenuItem value={4} >Supplier</MenuItem>
							<MenuItem value={5} >Range of Date</MenuItem>
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
	);
};