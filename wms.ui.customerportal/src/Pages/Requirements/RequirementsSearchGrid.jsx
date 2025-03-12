import React, { useEffect, useState } from 'react';

import { 
  Box,
  Grid, 
  MenuItem, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography, 
  Button, 
  Stack,
  Autocomplete
} from '@mui/material';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import { RequirementsAPI } from '@/services/RequirementsAPI';
import { InventoryAPI } from '@/services/InventoryAPI';
import { ShipmentsAPI } from '@/services/ShipmentsAPI';

import CustomAlert from '../../components/Global/CustomAlert';
import { TablePagination } from '../../components/Global/TablePagination';
import RequirementDetailsModal from './Dialog/RequirementDetailsModal';
import { RequirementsUploadTemplateModal } from './Dialog/RequirementUploadTemplateModal';
import SKUNotAllocatedModal from '../Inventory/Dialog/SKUNotAllocated';
import ShipmentsPackingListModal from '../Shipments/Dialog/ShipmentsPackingListModal';
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

export const RequirementsSearchGrid = ({ customerData, setIsLoading }) => {
  const [idUserState, setIdUserState] = useState(0);
  const [requirementsListData, setRequirementsListData] = useState([]);
  const [requirementDetailsData, setRequirementDetailsData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openRequirementDetails, setOpenRequirementDetails] = useState(false);
  const [endCustomer, setEndCustomer] = useState('');
  const [endCustomerError, setEndCustomerError] = useState('');
  const [CQFolio, setCQFolio] = useState('');
  const [CQFolioError, setCQFolioError] = useState('');
  const [CQCustomerFolio, setCQCustomerFolio] = useState('');
  const [CQCustomerFolioError, setCQCustomerFolioError] = useState('');
  const [supplier, setSupplier] = useState('');
  const [supplierError, setSupplierError] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [openSKUNotAllocatedModal, setOpenSKUNotAllocatedModal] = useState(false);
  const [uploadTemplateModalOpen, setUploadTemplateModalOpen] = useState(false);
  const [packingListData, setPackingListData] = useState([]);
  const [openPackingListModal, setOpenPackingListModal] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [SKUEndCustomerList, setSKUEndCustomerList] = useState([]);
  const [SupplierList, setSupplierList] = useState([]);
  // Obtener el UserId
  useEffect(() => {
    const ldata = getTokenInfo();
    let lintid = parseInt(ldata.nameid);
    setIdUserState(lintid);
  }, []);

  // Consulta por defecto cuando ya consigue el UserId
  useEffect(() => { 
    const fetchData = async () => {
      if (idUserState) {
        setIsLoading(true); 
        try {
          const response = await RequirementsAPI.ActiveRequirementsList(idUserState);
          setRequirementsListData(response.data);
        } catch (error) {
          console.log('Error fetching data: ', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [idUserState]);

  //Consulta de autocompletado
  useEffect(() => {
    if (selectedFilter === 1) {
      const fetchData = async () => {
        const filters = {
          intCustomerId: customerData.customerId,
        };
        const response = await RequirementsAPI.GetSKUList(filters);
        setSKUEndCustomerList(response.data);
      };
      fetchData();
    } else if (selectedFilter === 4){
      const fetchData = async () => {
        const filters = {
          intCustomerId: customerData.customerId,
        };
        const response = await RequirementsAPI.GetSupplierList(filters);
        setSupplierList(response.data);
      };
      fetchData();
    }
  }, [selectedFilter]);
  
  //Consulta por SKU End Customer y fechas
  const handleSearchSKUEndCustomer = () => {
		const fetchData = async () => {
			try{
        setIsLoading(true); 
				const filters = {
					intUserId: idUserState,
					strSKUEndCustomer: endCustomer,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await RequirementsAPI.GetListRequirementSKUEndCustomer(filters);
				setRequirementsListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			} finally {
        setIsLoading(false);
      }
		};
		if(!endCustomer || endCustomer.length < 3){
			setEndCustomerError('Se necesitan al menos 3 caracteres');
		}else{
			setEndCustomerError('');
			fetchData();
		}
  };


  //Consulta por CQ Folio y fechas
  useEffect(() => { 
		const fetchData = async () => {
			try{
        setIsLoading(true);
				const filters = {
					intUserId: idUserState,
					strCQFolio: CQFolio,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await RequirementsAPI.GetListRequirementCQFolio(filters);
				setRequirementsListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			} finally {
        setIsLoading(false);
      }
		};
		if(!CQFolio || CQFolio.length < 3){
			setCQFolioError('Se necesitan al menos 3 caracteres');
		}else{
			setCQFolioError('');
			fetchData();
		}
	}, [CQFolio, startDate, endDate]);

  //Consulta por CQ Customer Folio y fechas
  useEffect(() => { 
		const fetchData = async () => {
			try{
        setIsLoading(true);
				const filters = {
					intUserId: idUserState,
					strCQCustomerFolio: CQCustomerFolio,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await RequirementsAPI.GetListRequirementCQCustomerFolio(filters);
				setRequirementsListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			} finally {
        setIsLoading(false);
      }
		};
		if(!CQCustomerFolio || CQCustomerFolio.length < 3){
			setCQCustomerFolioError('Se necesitan al menos 3 caracteres');
		}else{
			setCQCustomerFolioError('');
			fetchData();
		}
	}, [CQCustomerFolio, startDate, endDate]);

  //Consulta por Supplier y fechas
  const handleSearchSupplier = () => { 
		const fetchData = async () => {
			try{
        setIsLoading(true);
				const filters = {
					intUserId: idUserState,
					strSupplier: supplier,
					dtmStartDate: startDate,
					dtmEndDate: endDate
				};
				filters.dtmStartDate = filters.dtmStartDate ? dayjs(filters.dtmStartDate).format('YYYY-MM-DD') : null;
				filters.dtmEndDate = filters.dtmEndDate ? dayjs(filters.dtmEndDate).format('YYYY-MM-DD') : null;
				const response = await RequirementsAPI.GetListRequirementSupplier(filters);
				setRequirementsListData(response.data);
			}catch(error){
				console.log('Error fetching data: ', error)
			} finally {
        setIsLoading(false);
      }
		};
		if(!supplier || supplier.length < 3){
			setSupplierError('Se necesitan al menos 3 caracteres');
		}else{
			setSupplierError('');
			fetchData();
		}
  }

  // Cuando se cambia el filtro (Reseteo de los campos)
	useEffect(() => {
		setEndCustomer('');
		setEndCustomerError('');
    setCQFolio('');
		setCQFolioError('');
    setCQCustomerFolio('');
		setCQCustomerFolioError('');
    setSupplier('');
		setSupplierError('');
		setStartDate(null);
    setEndDate(null);
		setRequirementsListData([]);
	  }, [selectedFilter]
	);

  // Cuando se selecciona un filtro
  const handleFilterClick = async (event) => {
		setSelectedFilter(event.target.value);  
		setPage(0);
	};

  // Cuando se abre el modal de detalles del requerimiento
  const handleOpenRequirementDetailsModal = async (row) => {
    try {
      const response = await RequirementsAPI.GetListRequirementDetails(row.strCQFolio);
      setRequirementDetailsData(response.data);
      setSelectedRowData({
        strCQFolio: row.strCQFolio,
        strAllocationDate: row.strAllocationDate,
        decProgress: row.decProgress
      });
      setOpenRequirementDetails(true);
    } catch (error) {
      console.log('Error fetching data: ', error);
    }
  };

  // Cuando se cambia la página
  const handleChangePage = (event, newPage) => { setPage(newPage) };

  // Cuando se cambia el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Cuando se cierra el alert
  const handleAlertClose = () => { setAlert((prev) => ({ ...prev, open: false })) };

  // Cuando se da click en la celda de qty not allocated
  const handleQtyNotAllocated = async(row) => {
    try {
        setIsLoading(true);
        const filters = {
            intUserId: idUserState,
            intInvId: row.intInventoryId,
            strSKU: row.strSKUEndCustomer
        };
        const response = await InventoryAPI.GetSKUNOTAllocated(filters);
        setRequirementDetailsData(response.data);
        setSelectedRowData({
            strSKUEndCustomer: row.strSKUEndCustomer
        });
        setOpenSKUNotAllocatedModal(true);
    } catch (error) {
      console.log('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Cuando se da click en la celda de qty shipped
  const handlePackingList = async(row) => {
    if (row.decQtyShipped === null || row.decQtyShipped === 0 || row.decQtyShipped === "") {
        setAlert({ open: true, message: "No hay ningún qty shipped para poder revisar el package list.", severity: 'warning' });
        return;
    }
    try {
        setIsLoading(true);
        const response = await ShipmentsAPI.GetListShipmentDetails(row.intShipmentId);
        setPackingListData(response.data);
        setOpenPackingListModal(true);
    } catch (error) {
        console.log('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Datos paginados
  const paginatedData = requirementsListData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderInputs = () => {
		switch (selectedFilter) {
			case 0:
				return null;
			case 1:
				return(
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Stack spacing={2} sx={{ width: 300 }}>
                <Autocomplete
                  id="SKUEndCustomer"
                  freeSolo
                  options={SKUEndCustomerList.map((option) => option.strName)}
                  onChange={(event, newValue) => {
                    setEndCustomer(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="SKU End Customer" 
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
                onClick={handleSearchSKUEndCustomer}
                sx={{padding: '15px'}}
              >Search
              </Button>
            </Box>
          </LocalizationProvider>
        )
      case 2:
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box
							sx={{ 
								display: 'flex',
								alignItems: 'flex-start',
								gap: 3 }
							}
						>
						<TextField
							label='CQ Folio'
							value={CQFolio}
							onChange={(event) => setCQFolio(event.target.value)}
							error={!!CQFolioError}
                			helperText={CQFolioError}
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
        )
      case 3:
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{ 
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3 }
              }
            >
            <TextField
              label='CQ Customer Folio'
              value={CQCustomerFolio}
              onChange={(event) => setCQCustomerFolio(event.target.value)}
              error={!!CQCustomerFolioError}
                      helperText={CQCustomerFolioError}
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
        )
      case 4:
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{ 
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3 }
              }
            >
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                id="Supplier"
                freeSolo
                options={SupplierList.map((option) => option.strName)}
                onChange={(event, newValue) => {
                  setSupplier(newValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Supplier" 
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
            >Search
            </Button>
          </Box>
        </LocalizationProvider>
        )
      default:
        return null;
		}
	}

  const renderTable = () => {
    switch (selectedFilter) {
			case 0: 
				//Muestra los requerimientos activos, por defecto
        return (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={GridStyle.head}>
                  <TableCell align='left' sx={{ color: 'white' }}>Req Date</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>CQ Folio</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Customer Folio</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>% de Avance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  paginatedData.map((row, index) => (
                    <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                      <TableCell align="right">{row.strAllocationDate}</TableCell>
                      <TableCell align="left" onClick={() => handleOpenRequirementDetailsModal(row)}>
                        <Typography component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500' }}>
                          {row.strCQFolio}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.strCustomerFolio}</TableCell>
                      <TableCell align="left">{row.decProgress}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <TablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              count={requirementsListData.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <RequirementDetailsModal
              open={openRequirementDetails}
              onClose={() => setOpenRequirementDetails(false)}
              data={requirementDetailsData}
              selectedRowData={selectedRowData}
              idUserState={idUserState}
            />
          </TableContainer>
        )
      case 1:
        return (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={GridStyle.head}>
                  <TableCell align='left' sx={{ color: 'white' }}>SKU End Customer</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>UOM</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>CQ Folio</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Customer Folio</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Date Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>% de Avance</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Not Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Picked</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Shipped</ TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  paginatedData.map((row, index) => (
                    <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                      <TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                      <TableCell align="left">{row.strUOM}</TableCell>
                      <TableCell align="left">{row.strCQFolio}</TableCell>
                      <TableCell align="left">{row.intCustomerFolio}</TableCell>
                      <TableCell align="left">{row.strDateRequired}</TableCell>
                      <TableCell align="left">{row.intAdvancePercentage}</TableCell>
                      <TableCell align="left">{row.decQtyRequired}</TableCell>
                      <TableCell align="left">{row.decQtyAllocated}</TableCell>
                      <TableCell align='left' onClick={() => handleQtyNotAllocated(row)}>
                        <Typography component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500' }}>
                          {row.decQtyNotAllocated}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.intQtyPickeds}</TableCell>
                      <TableCell align='left' onClick={() => handlePackingList(row)}>
                        <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                          {row.decQtyShipped}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={requirementDetailsData} selectedRowData={selectedRowData} />
            <ShipmentsPackingListModal open={openPackingListModal} onClose={() => setOpenPackingListModal(false)} data={packingListData} />
            <TablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              count={requirementsListData.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <CustomAlert
                open={alert.open}
                onClose={handleAlertClose}
                severity={alert.severity}
                message={alert.message}
            />
          </TableContainer>
        )
      case 2:
        return (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={GridStyle.head}>
                  <TableCell align='left' sx={{ color: 'white' }}>SKU End Customer</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>UOM</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>CQ Folio</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Date Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>% de Avance</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Not Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Picked</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Shipped</ TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  paginatedData.map((row, index) => (
                    <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                      <TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                      <TableCell align="left">{row.strUOM}</TableCell>
                      <TableCell align="left">{row.strCQFolio}</TableCell>
                      <TableCell align="left">{row.strDateRequired}</TableCell>
                      <TableCell align="left">{row.intAdvancePercentage}</TableCell>
                      <TableCell align="left">{row.decQtyRequired}</TableCell>
                      <TableCell align="left">{row.decQtyAllocated}</TableCell>
                      <TableCell align='left' onClick={() => handleQtyNotAllocated(row)}>
                        <Typography component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500' }}>
                          {row.decQtyNotAllocated}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.intQtyPickeds}</TableCell>
                      <TableCell align='left' onClick={() => handlePackingList(row)}>
                        <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                          {row.decQtyShipped}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={requirementDetailsData} selectedRowData={selectedRowData} />
            <ShipmentsPackingListModal open={openPackingListModal} onClose={() => setOpenPackingListModal(false)} data={packingListData} />
            <TablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              count={requirementsListData.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <CustomAlert
                open={alert.open}
                onClose={handleAlertClose}
                severity={alert.severity}
                message={alert.message}
            />
          </TableContainer>
        )
      case 3:
        return (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={GridStyle.head}>
                  <TableCell align='left' sx={{ color: 'white' }}>SKU End Customer</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>UOM</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>CQ Customer Folio</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Date Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>% de Avance</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Not Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Picked</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Shipped</ TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  paginatedData.map((row, index) => (
                    <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                      <TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                      <TableCell align="left">{row.strUOM}</TableCell>
                      <TableCell align="left">{row.strCQCustomerFolio}</TableCell>
                      <TableCell align="left">{row.strDateRequired}</TableCell>
                      <TableCell align="left">{row.intAdvancePercentage}</TableCell>
                      <TableCell align="left">{row.decQtyRequired}</TableCell>
                      <TableCell align="left">{row.decQtyAllocated}</TableCell>
                      <TableCell align='left' onClick={() => handleQtyNotAllocated(row)}>
                        <Typography component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500' }}>
                          {row.decQtyNotAllocated}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.intQtyPickeds}</TableCell>
                      <TableCell align='left' onClick={() => handlePackingList(row)}>
                        <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                          {row.decQtyShipped}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={requirementDetailsData} selectedRowData={selectedRowData} />
            <ShipmentsPackingListModal open={openPackingListModal} onClose={() => setOpenPackingListModal(false)} data={packingListData} />
            <TablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              count={requirementsListData.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <CustomAlert
                open={alert.open}
                onClose={handleAlertClose}
                severity={alert.severity}
                message={alert.message}
            />
          </TableContainer>
        )
      case 4:
        return (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={GridStyle.head}>
                  <TableCell align='left' sx={{ color: 'white' }}>SKU End Customer</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>SKU Supplier</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>UOM</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>% de Avance</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Required</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Not Allocated</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Picked</TableCell>
                  <TableCell align='left' sx={{ color: 'white' }}>Qty Shipped</ TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  paginatedData.map((row, index) => (
                    <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                      <TableCell align="left">{row.strSKUEndCustomer}</TableCell>
                      <TableCell align="left">{row.strSupplier}</TableCell>
                      <TableCell align="left">{row.strUOM}</TableCell>
                      <TableCell align="left">{row.intAdvancePercentage}</TableCell>
                      <TableCell align="left">{row.decQtyRequired}</TableCell>
                      <TableCell align="left">{row.decQtyAllocated}</TableCell>
                      <TableCell align='left' onClick={() => handleQtyNotAllocated(row)}>
                        <Typography component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500' }}>
                          {row.decQtyNotAllocated}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.intQtyPickeds}</TableCell>
                      <TableCell align='left' onClick={() => handlePackingList(row)}>
                        <Typography  component="span" sx={{ color: '#646cff', cursor: 'pointer', fontWeight: '500', }}>
                          {row.decQtyShipped}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <SKUNotAllocatedModal open={openSKUNotAllocatedModal} onClose={() => setOpenSKUNotAllocatedModal(false)} data={requirementDetailsData} selectedRowData={selectedRowData} />
            <ShipmentsPackingListModal open={openPackingListModal} onClose={() => setOpenPackingListModal(false)} data={packingListData} />
            <TablePagination
              page={page}
              rowsPerPage={rowsPerPage}
              count={requirementsListData.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <CustomAlert
                open={alert.open}
                onClose={handleAlertClose}
                severity={alert.severity}
                message={alert.message}
            />
          </TableContainer>
        )
      default:
        return null
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item container spacing={3}>
				<Grid item >
					<Box sx={{ display: 'flex', justifyContent: 'start', mt: 3, gap: 3 }}>
            {/* Botón para agregar requerimiento manualmente */}
            <Button
              variant="contained"
              component="span"
              color="primary"
              onClick={() => setUploadTemplateModalOpen(true)}
            >Add
            </Button>
            {/* Modal para mostrar los datos procesados */}
            <RequirementsUploadTemplateModal
              open={uploadTemplateModalOpen}
              onClose={() => setUploadTemplateModalOpen(false)}
              userId={idUserState}
              customerInfo={customerData}
            />
						<Select 
							value={selectedFilter}
							defaultValue={0}
							label='Filter'
							onChange={handleFilterClick}
							sx={{ width: 200 }}
							MenuProps={{
								PaperProps: {
									sx: { '& .MuiListSubheader-root': {backgroundColor: '#f0f0f0', }},
								},
							}
						}>
							<MenuItem value={0} disabled>Select a filter</MenuItem>
							<MenuItem value={1} >SKU End Customer</MenuItem>
							<MenuItem value={2} >Req. CQ Folio</MenuItem>
							<MenuItem value={3} >Req. CQ Customer Folio</MenuItem>
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
  )
};