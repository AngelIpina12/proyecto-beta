import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TablePagination, CircularProgress, Button, Stack, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SKUInProcessOfWOModal from './Dialog/SKUInProcessOfWO';
import SKUAllocatedModal from './Dialog/SKUAllocated';
import SKUNotAllocatedModal from './Dialog/SKUNotAllocated';
import SKUOnHandModal from './Dialog/SKUOnHand';
import { InventoryAPI } from '@/services/InventoryAPI';
import { userAPI } from '../../services/userAPI';
import { CatalogoAPI } from '@/services/CatalogoAPI';
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

export const InventorySearchGrid = () => {
    const [Iduserstate, setIduserstate] = useState('');
    const [customerId, setCustomerId] = useState(-1);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [detailsData, setDetailsData] = useState([]);
    const [skuEndCustomer, setSkuEndCustomer] = useState('');
    const [skuEndCustomerError, setSkuEndCustomerError] = useState('');
    const [skuEndCustomerOptions, setSkuEndCustomerOptions] = useState([]);
    const [endCustomer, setEndCustomer] = useState('');
    const [endCustomerError, setEndCustomerError] = useState('');
    const [endCustomerOptions, setEndCustomerOptions] = useState([]);
    const [supplierSKU, setSupplierSKU] = useState('');
    const [supplierSKUError, setSupplierSKUError] = useState('');
    const [supplierSKUOptions, setSupplierSKUOptions] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [supplierError, setSupplierError] = useState('');
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [inventoryListData, setInventoryListData] = useState([]);
    const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSKUInProcessOfWOModal, setOpenSKUInProcessOfWOModal] = useState(false);
    const [openSKUAllocatedModal, setOpenSKUAllocatedModal] = useState(false);
    const [openSKUNotAllocatedModal, setOpenSKUNotAllocatedModal] = useState(false);
    const [openSKUOnHandModal, setOpenSKUOnHandModal] = useState(false);
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
                    const response = await InventoryAPI.TodayInventoryList(Iduserstate);
                    setInventoryListData(response.data);
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

    useEffect(() => { // Autocompletado de SKU EndCustomer
        if(!skuEndCustomer || skuEndCustomer === ''){
            setSkuEndCustomerOptions([]);
            return;
        } else if(skuEndCustomer.length < 3){
            setSkuEndCustomerError('Se necesitan al menos 3 caracteres');
            setSkuEndCustomerOptions([]);
            return;
        } else {
            setSkuEndCustomerError('');
            setLoading(true);
            const fetchData = async () => {
                try{
                    const filters = {
                        strName: skuEndCustomer,
                        customerId: customerId
                    };
                    const response = await CatalogoAPI.GetProductSKUCustom(filters);
                    setSkuEndCustomerOptions(response.data);
                } catch(error){
                    console.log('Error fetching data: ' + error);
                } finally {
                    setLoading(false);
                }
            };
            const debounceTimeout = setTimeout(() => {
				fetchData();
			}, 300);
			return () => clearTimeout(debounceTimeout);
        }
    }, [skuEndCustomer]);

    useEffect(() => { // Autocompletado de EndCustomer
        if(!endCustomer || endCustomer === ''){
            setEndCustomerOptions([]);
            return;
        } else if(endCustomer.length < 3){
            setEndCustomerError('Se necesitan al menos 3 caracteres');
            setEndCustomerOptions([]);
            return;
        } else {
            setEndCustomerError('');
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
                    console.log('Error fetching data: ' + error);
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

    useEffect(() => { // Autocompletado de SKU Supplier
        if(!supplierSKU || supplierSKU === ''){
            setSupplierSKUOptions([]);
            return;
        } else if(supplierSKU.length < 3){
            setSupplierSKUError('Se necesitan al menos 3 caracteres');
            setSupplierSKUOptions([]);
            return;
        } else {
            setSkuEndCustomerError('');
            setLoading(true);
            const fetchData = async () => {
                try{
                    const filters = {
                        strName: supplierSKU,
                        intUserId: Iduserstate
                    };
                    const response = await CatalogoAPI.GetSupplierSKU(filters);
                    setSupplierSKUOptions(response.data);
                } catch(error){
                    console.log('Error fetching data: ' + error);
                } finally {
                    setLoading(false);
                }
            };
            const debounceTimeout = setTimeout(() => {
				fetchData();
			}, 300);
			return () => clearTimeout(debounceTimeout);
        }
    }, [supplierSKU]);

    useEffect(() => { // Autocompletado de Supplier
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
					const filters = { 
                        strName: supplier, 
                        intUserId: Iduserstate, 
                    };
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

	const handleSearchSkuEndCustomer = () => { // Consulta por SKU de EndCustomer
        const fetchData = async () => {
			try{
				const filters = {
                    strSKU: skuEndCustomer,
                    skuEndCustomer: Iduserstate,
                };
                const response = await InventoryAPI.GetInvByEndSKU(filters);
                console.log()
                setInventoryListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error);
			}
		};
		fetchData();
    };

    const handleSearchEndCustomer = () => { // Consulta por SKU de EndCustomer
        const fetchData = async () => {
			try{
				const filters = {
                    intUserId: Iduserstate,
                    strEndCustomer: endCustomer
                };
                const response = await InventoryAPI.GetInvByEndCustomer(filters);
                setInventoryListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error);
			}
		};
		fetchData();
    };

    const handleSearchSupplierSku = () => { // Consulta por Supplier SKU
        const fetchData = async () => {
			try{
				const filters = {
                    intUserId: Iduserstate,
                    strSupplierSKU: supplierSKU
                };
                const response = await InventoryAPI.GetInvBySupplierSKU(filters);
                setInventoryListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error);
			}
		};
		fetchData();
    };

    const handleSearchSupplier = () => { //Consulta por Supplier
        const fetchData = async () => {
			try{
				const filters = {
                    intUserId: Iduserstate,
                    strSupplierName: supplier
                };
                const response = await InventoryAPI.GetInvBySupplier(filters);
                setInventoryListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error);
			}
		};
		if(!supplier || supplier.length < 3){
			setSupplierError('Se necesitan la menos 3 caracteres');
		}else{
			setSupplierError('');
			fetchData();
		}
    };
    
    useEffect(() => { // Limpia los filtros
        setSkuEndCustomer('');
        setSkuEndCustomerError('');
        setEndCustomer('');
        setEndCustomerError('');
        setSupplierSKU('');
        setSupplierSKUError('');
        setSupplier('');
        setSupplierError('');
        setInventoryListData([]);
        setSelectedRowData(null);
	}, [selectedFilter]);

    const handleSKUInProcessOfWO = async (row) => {
        try {
            const filters = {
                intUserId: Iduserstate,
                intinvid: row.intinvid,
                strSKU: row.strSKUEndCustomer
            };
            const response = await InventoryAPI.GetSKUInWork(filters);
            setDetailsData(response.data);
            setSelectedRowData({
                strSKUEndCustomer: row.strSKUEndCustomer
            });
            setOpenSKUInProcessOfWOModal(true);
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
    };

    const handleSKUAllocated = async (row) => {
        try {
            const filters = {
                intUserId: Iduserstate,
                intinvid: row.intinvid,
                strSKU: row.strSKUEndCustomer
            };
            const response = await InventoryAPI.GetSKUAllocated(filters);
            setDetailsData(response.data);
            setOpenSKUAllocatedModal(true);
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
    }

    const handleSKUNotAllocated = async(row) => {
        try {
            const filters = {
                intUserId: Iduserstate,
                intinvid: row.intinvid,
                strSKU: row.strSKUEndCustomer
            };
            const response = await InventoryAPI.GetSKUNOTAllocated(filters);
            setDetailsData(response.data);
            setSelectedRowData({
                strSKUEndCustomer: row.strSKUEndCustomer
            });
            setOpenSKUNotAllocatedModal(true);
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
    }

    const handleSKUOnHand = async(row) => {
        try {
            const filters = {
                intUserId: Iduserstate,
                intinvid: row.intinvid,
                strSKU: row.strSKUEndCustomer
            };
            const response = await InventoryAPI.GetSKUOnHand(filters);
            setDetailsData(response.data);
            setSelectedRowData({
                strSKUEndCustomer: row.strSKUEndCustomer
            });
            setOpenSKUOnHandModal(true);
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
    }

    // Metodos para los paginadores
    const handleFilterClick = async (event) => {
		setSelectedFilter(event.target.value);  
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
			case 0: // Consulta por defecto
				return null;
            case 1: // Consulta por SKU de EndCustomer
				return(
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 } }>
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <Autocomplete
                            id="skuEndCustomer"
                            freeSolo
                            options={skuEndCustomerOptions}
                            getOptionLabel={(option) => option.name || ''}
                            filterOptions={(x) => x}
                            onInputChange={(event, newInputValue) => setSkuEndCustomer(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label='SKU End Customer'
                                variant="outlined"
                                value={skuEndCustomer}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                        </>
                                        ),
                                    }}
                                error={!!skuEndCustomerError}
                                helperText={skuEndCustomerError}
                                />
                            )}
                            />
                        </Stack>
                        <Button
                        variant="contained"
                        component="span"
                        color="primary"
                        onClick={handleSearchSkuEndCustomer}
                        sx={{padding: '15px'}}
						>
                            <SearchIcon sx={{ color: 'white' }} />
                        </Button>
                    </Box>
                )
            case 2: // Consulta por End Customer
                return(
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 } }>
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <Autocomplete
                            id="endCustomer"
                            freeSolo
                            options={endCustomerOptions}
                            getOptionLabel={(option) => option.name || ''}
                            filterOptions={(x) => x}
                            onInputChange={(event, newInputValue) => setEndCustomer(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label='End Customer'
                                variant="outlined"
                                value={endCustomer}
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
                )
            case 3: // Consulta por SKU de Supplier
                return(
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 } }>
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <Autocomplete
                            id="skuSupplier"
                            freeSolo
                            options={supplierSKUOptions}
                            getOptionLabel={(option) => option.strSupplierSKU || ''}
                            filterOptions={(x) => x}
                            onInputChange={(event, newInputValue) => setSupplierSKU(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label='Supplier SKU'
                                variant="outlined"
                                value={supplierSKU}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                        </>
                                        ),
                                    }}
                                error={!!supplierSKUError}
                                helperText={supplierSKUError}
                                />
                            )}
                            />
                        </Stack>
                        <Button
                        variant="contained"
                        component="span"
                        color="primary"
                        onClick={handleSearchSupplierSku}
                        sx={{padding: '15px'}}
						>
                            <SearchIcon sx={{ color: 'white' }} />
                        </Button>
                    </Box>
                )
            case 4: // Consulta por Supplier
                return(
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 } }>
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <Autocomplete
                            id="supplier"
                            freeSolo
                            options={supplierOptions}
                            getOptionLabel={(option) => option.name || ''}
                            filterOptions={(x) => x}
                            onInputChange={(event, newInputValue) => setSupplier(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label='Supplier'
                                variant="outlined"
                                value={supplier}
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
                )
            default:
                return null;
        }
    }

    const renderTable = () =>{
        const paginatedData = inventoryListData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
		switch (selectedFilter) {
            case 0: 
				// Muestra los registros de hoy, por defecto
				return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left' sx={{color: 'white'}}>SKU End Customer</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>SKU Supplier</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Total Inventory Pieces</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>UOM</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>On Hand</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Wo Pieces</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Allocated</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Not Allocated</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Picked</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Shipped</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>Lote</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>Job Number</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {inventoryListData ? 
                                (paginatedData.map((row, index) => (
										<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
											<TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                                            <TableCell align="left">{row.strSKUSupplier}</TableCell>
                                            <TableCell align="left">{row.strWayShip}</TableCell>
                                            <TableCell align="right">{row.intBox} / {row.intBox}</TableCell>
                                            <TableCell align="right">{row.intToltalInvPieces}</TableCell>
                                            <TableCell align="left">{row.strUOM}</TableCell>
                                            <TableCell align="right" onClick={() => handleSKUOnHand(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intOnHand}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUInProcessOfWO(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intWOPieces}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUNotAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesNotAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesPicked}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">{row.intPiecesShipped}</TableCell>
                                            <TableCell align="left">{row.strLot}</TableCell>
                                            <TableCell align="left">{row.strJobNumber}</TableCell>
										</TableRow>
									))
                                ) : (
                                    <CircularProgress />
                                )}
							</TableBody>
						</Table>
                        <SKUInProcessOfWOModal open={openSKUInProcessOfWOModal} onClose={() => setOpenSKUInProcessOfWOModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUAllocatedModal open={openSKUAllocatedModal} onClose={() => setOpenSKUAllocatedModal(false)} data={detailsData} />
                        <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUOnHandModal open={openSKUOnHandModal} onClose={() => setOpenSKUOnHandModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={inventoryListData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
					</TableContainer>
				)
            case 1:
                // Muestra los registros filtrados por SKU de EndCustomer
                return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left' sx={{color: 'white'}}>SKU End Customer</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Total Inventory Pieces</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>UOM</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>On Hand</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Wo Pieces</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Allocated</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Not Allocated</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {inventoryListData ? 
                                    (paginatedData.map((row, index) => (
										<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
											<TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                                            <TableCell align="right">{row.intToltalInvPieces}</TableCell>
                                            <TableCell align="left">{row.strUOM}</TableCell>
                                            <TableCell align="left">{row.strWayShip}</TableCell>
                                            <TableCell align="right">{row.intPallets}/{row.intBox}</TableCell>
                                            <TableCell align="right" onClick={() => handleSKUOnHand(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intOnHand}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUInProcessOfWO(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intWOPieces}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUNotAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesNotAllocated}
                                                </Typography>
                                            </TableCell>
										</TableRow>
									))
                                ) : (
                                    <CircularProgress />
                                )}
							</TableBody>
						</Table>
                        <SKUInProcessOfWOModal open={openSKUInProcessOfWOModal} onClose={() => setOpenSKUInProcessOfWOModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUAllocatedModal open={openSKUAllocatedModal} onClose={() => setOpenSKUAllocatedModal(false)} data={detailsData} />
                        <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUOnHandModal open={openSKUOnHandModal} onClose={() => setOpenSKUOnHandModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={inventoryListData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
					</TableContainer>
				)
            case 2:
                // Muestra los registros filtrados por EndCustomer
                return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
									<TableCell align='left' sx={{color: 'white'}}>End Customer</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>SKU End Customer</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>SKU Supplier</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Total Inventory Pieces</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>UOM</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>On Hand</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Wo Pieces</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Allocated</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Not Allocated</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {inventoryListData ? 
                                    (paginatedData.map((row, index) => (
										<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
											<TableCell align="left">{row.strCustomerName}</TableCell>
                                            <TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                                            <TableCell align="left">{row.strSKUSupplier}</TableCell>
                                            <TableCell align="right">{row.intToltalInvPieces}</TableCell>
                                            <TableCell align="left">{row.strUOM}</TableCell>
                                            <TableCell align="left">{row.strWayShip}</TableCell>
                                            <TableCell align="right">{row.intPallets}/{row.intBox}</TableCell>
                                            <TableCell align="right" onClick={() => handleSKUOnHand(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intOnHand}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUInProcessOfWO(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intWOPieces}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUNotAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesNotAllocated}
                                                </Typography>
                                            </TableCell>
										</TableRow>
									))
                                ) : (
                                    <CircularProgress />
                                )}
							</TableBody>
						</Table>
                        <SKUInProcessOfWOModal open={openSKUInProcessOfWOModal} onClose={() => setOpenSKUInProcessOfWOModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUAllocatedModal open={openSKUAllocatedModal} onClose={() => setOpenSKUAllocatedModal(false)} data={detailsData} />
                        <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUOnHandModal open={openSKUOnHandModal} onClose={() => setOpenSKUOnHandModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={inventoryListData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
					</TableContainer>
				)
            case 3:
                // Muestra los registros filtrados por Supplier SKU
                return (
					<TableContainer>
						<Table sx={{minWidth: 650}} aria-label='simple table'>
							<TableHead>
								<TableRow sx={GridStyle.head}>
                                    <TableCell align='left' sx={{color: 'white'}}>SKU Supplier</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Total Inventory Pieces</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>UOM</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>On Hand</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Wo Pieces</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Allocated</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Not Allocated</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {inventoryListData ? 
                                    (paginatedData.map((row, index) => (
										<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
											<TableCell align="left">{row.strSKUSupplier}</TableCell>
                                            <TableCell align="right">{row.intToltalInvPieces}</TableCell>
                                            <TableCell align="left">{row.strUOM}</TableCell>
                                            <TableCell align="left">{row.strWayShip}</TableCell>
                                            <TableCell align="right">{row.intPallets}/{row.intBox}</TableCell>
                                            <TableCell align="right" onClick={() => handleSKUOnHand(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intOnHand}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUInProcessOfWO(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intWOPieces}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUNotAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesNotAllocated}
                                                </Typography>
                                            </TableCell>
										</TableRow>
									))
                                ) : (
                                    <CircularProgress />
                                )}
							</TableBody>
						</Table>
                        <SKUInProcessOfWOModal open={openSKUInProcessOfWOModal} onClose={() => setOpenSKUInProcessOfWOModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUAllocatedModal open={openSKUAllocatedModal} onClose={() => setOpenSKUAllocatedModal(false)} data={detailsData} />
                        <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUOnHandModal open={openSKUOnHandModal} onClose={() => setOpenSKUOnHandModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={inventoryListData.length}
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
                                    <TableCell align='left' sx={{color: 'white'}}>SKU Supplier</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>SKU End Customer</TableCell>
									<TableCell align='right' sx={{color: 'white'}}>Total Inventory Pieces</TableCell>
                                    <TableCell align='left' sx={{color: 'white'}}>UOM</TableCell>
									<TableCell align='left' sx={{color: 'white'}}>Way of Shipping</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Qty Pallets / Box</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>On Hand</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Wo Pieces</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Allocated</TableCell>
                                    <TableCell align='right' sx={{color: 'white'}}>Pieces Not Allocated</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {inventoryListData ? 
                                    (paginatedData.map((row, index) => (
										<TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
											<TableCell align="left">{row.strSUpplierName}</TableCell>
                                            <TableCell align="left">{row.strSKUSupplier}</TableCell>
                                            <TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                                            <TableCell align="right">{row.intToltalInvPieces}</TableCell>
                                            <TableCell align="left">{row.strUOM}</TableCell>
                                            <TableCell align="left">{row.strWayShip}</TableCell>
                                            <TableCell align="right">{row.intPallets}/{row.intBox}</TableCell>
                                            <TableCell align="right" onClick={() => handleSKUOnHand(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intOnHand}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUInProcessOfWO(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intWOPieces}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesAllocated}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" onClick={() => handleSKUNotAllocated(row)}>
                                                <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                                                    {row.intPiecesNotAllocated}
                                                </Typography>
                                            </TableCell>
										</TableRow>
									))
                                ) : (
                                    <CircularProgress />
                                )}
							</TableBody>
						</Table>
                        <SKUInProcessOfWOModal open={openSKUInProcessOfWOModal} onClose={() => setOpenSKUInProcessOfWOModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUAllocatedModal open={openSKUAllocatedModal} onClose={() => setOpenSKUAllocatedModal(false)} data={detailsData} />
                        <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <SKUOnHandModal open={openSKUOnHandModal} onClose={() => setOpenSKUOnHandModal(false)} data={detailsData} selectedRowData={selectedRowData} />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={inventoryListData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
					</TableContainer>
				)
            default:
                return null;
        }
    }
    
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
                                            backgroundColor: '#f0f0f0', 
										},
                                    },
								},
							}}>
							<MenuItem value={0} disabled>Select a filter</MenuItem>
							<MenuItem value={1} >SKU End Customer</MenuItem>
							<MenuItem value={2} >End Customer</MenuItem>
							<MenuItem value={3} >Supplier SKU</MenuItem>
							<MenuItem value={4} >Supplier</MenuItem>
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