import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, ListSubheader, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { YARD_SUMMARY_ROUTE } from '../../Pages/routes';
import { YardAPI } from '@/services/YardAPI';
import dayjs from 'dayjs';
import { getTokenInfo } from '../../utils';



export const TrailerSearchGrid = ({ statusValueToday, updateStatusValueToday }) => {

  const [selectedFilter, setSelectedFilter] = useState(0);
  const [Iduserstate, setIduserstate] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [trailerFolioNumber, setTrailerFolioNumber] = useState('');
  const [trailerNumber, setTrailerNumber] = useState('');
  const [trailerFolioNumberError, setTrailerFolioNumberError] = useState('');
  const [trailerNumberError, setTrailerNumberError] = useState('');
  const [dataTwo, setdataTwo] = useState(
    [{
      "Id": 0
      , "DtmRegistrationDate": ""
      , 'DtmReceivedDate': ""
      , "strTrailerFolio": "no rows"
      , "strTrailerNumber": ""
      , "strSeal": ""
      , "strCarrierLine": ""
      , "strDriverName": ""
      , "strStatus": ""
    }]);

  useEffect(() => {
    const ldata = getTokenInfo();
    let lintid = ldata.nameid;
    
    setIduserstate(lintid);

  }, []);

  useEffect(() => {
    setTrailerFolioNumber('');
    setTrailerFolioNumberError('');
    setTrailerNumber('');
    setTrailerNumberError('');
    setStartDate(null);
    setEndDate(null);
    
    if (selectedFilter === 1) {
      handleTodayClick();
    }
  }, [selectedFilter]);

  useEffect(() => {
    if (trailerFolioNumber.length >= 3) {
      setTrailerFolioNumberError('');

      handleTrailerFolioNumberClick();

    } else if (trailerFolioNumber.length > 0) {
      setTrailerFolioNumberError('Se necesitan al menos 3 caracteres.');
    }
  }, [trailerFolioNumber, startDate, endDate]);

  useEffect(() => {
    if (trailerNumber.length >= 3) {
      setTrailerNumberError('');

      handleTrailerNumberClick();

    } else if (trailerNumber.length > 0) {
      setTrailerNumberError('Se necesitan al menos 3 caracteres.');
    }
  }, [trailerNumber, startDate, endDate]);

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      handleStatusClick(0, selectedFilter);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const handleFilterChange = async (newFilter) => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      handleStatusClick(1, newFilter);
    };
  
    if (statusValueToday > 0) {
      handleFilterChange(statusValueToday);
      updateStatusValueToday(0);
    }
  }, [statusValueToday]);

  const handleFilterClick = async (event) => {
    setSelectedFilter(event.target.value);  
  };

  const fetchYardManageList = async (filterOverrides) => {
    const defaultFilterDat = {
      userId: Iduserstate,
      intIsToday: 0,
      intIsTrailerFolio: 0,
      strTrailerFolio: '',
      intIsRangeDate: 0,
      dtmStartDate: null,
      dtmEndDate: null,
      intIsTrailerNumber: 0,
      strTrailerNumber: '',
      intStatusId: 0,
      strStatusVal: ''
    };
  
    const FilterDat = { ...defaultFilterDat, ...filterOverrides };
  
    try {
      FilterDat.dtmStartDate = FilterDat.dtmStartDate ? dayjs(FilterDat.dtmStartDate).format('YYYY-MM-DD') : null;
      FilterDat.dtmEndDate = FilterDat.dtmEndDate ? dayjs(FilterDat.dtmEndDate).format('YYYY-MM-DD') : null;

      const retobject = await YardAPI.YardManageList({ FilterDat });
      setdataTwo(retobject.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTodayClick = async () => {
    fetchYardManageList({
      intIsToday: 1
    });
  };

  const handleTrailerFolioNumberClick = async () => {
    fetchYardManageList({
      intIsTrailerFolio: 1,
      strTrailerFolio: trailerFolioNumber,
      dtmStartDate: startDate,
      dtmEndDate: endDate,
    });
  };

  const handleTrailerNumberClick = async () => {
    fetchYardManageList({
      intIsTrailerNumber: 1,
      strTrailerNumber: trailerNumber,
      dtmStartDate: startDate,
      dtmEndDate: endDate,
    });
  };

  const handleStatusClick = async (isToday, filter) => {
    let statusName = '';
  
    switch (filter) {
      case 5:
        statusName = 'Yard Empty IN';
        break;
      case 6:
        statusName = 'Yard Empty OUT';
        break;
      case 7:
        statusName = 'Unloading Process';
        break;
      case 8:
        statusName = 'Yard Loaded IN';
        break;
      case 9:
        statusName = 'Yard Loaded OUT';
        break;
      case 10:
        statusName = 'Loading Process';
        break;
      default:
        break;
    }
  
    if (statusName !== '' && isToday === 1) {
      fetchYardManageList({
        intIsToday: 1,
        intStatusId: 1,
        strStatusVal: statusName,
      });
    } else if (statusName !== '' && isToday === 0) {
      fetchYardManageList({
        intStatusId: 1,
        strStatusVal: statusName,
        dtmStartDate: startDate,
        dtmEndDate: endDate,
      });
    }
  };

  const renderInputs = () => {
    switch (selectedFilter) {
      case 0:
      case 1:
        return null;
      case 2:
        return(
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3 }}
            >
              <TextField 
                label="Trailer Folio Number"
                value={trailerFolioNumber}
                onChange={(event) => setTrailerFolioNumber(event.target.value)}
                error={!!trailerFolioNumberError}
                helperText={trailerFolioNumberError}
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
      case 3:
        return(
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3 }}
            >
              <TextField 
                label="Trailer Number"
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
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return(
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3 }}
            >
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

  return (
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
                      // Color de fondo diferente para el ListSubheader
                      backgroundColor: '#f0f0f0', 
                    },
                  },
                },
              }}
            >
              <MenuItem value={0} disabled>Select a filter</MenuItem>
              <MenuItem value={1}>Today</MenuItem>
              <MenuItem value={2}>Trailer Folio #</MenuItem>
              <MenuItem value={3}>Trailer #</MenuItem>
              <ListSubheader>Status</ListSubheader>
              <MenuItem value={5}>Yard Empty IN</MenuItem>
              <MenuItem value={6}>Yard Empty OUT</MenuItem>
              <MenuItem value={7}>Unloading Process</MenuItem>
              <MenuItem value={8}>Yard Loaded IN</MenuItem>
              <MenuItem value={9}>Yard Loaded OUT</MenuItem>
              <MenuItem value={10}>Loading Process</MenuItem>
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
        <TableContainer >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead  >
              <TableRow sx={GridStyle.head}>

                <TableCell align="right" sx={{ color: 'white' }} >Date&nbsp; &  &nbsp;Time&nbsp;Register</TableCell>
                <TableCell align="right" sx={{ color: 'white' }} >Date&nbsp;& &nbsp;Time&nbsp;Received</TableCell>
                <TableCell align="right" sx={{ color: 'white' }} >Trailer&nbsp;Folio&nbsp;#</TableCell>
                <TableCell align="right" sx={{ color: 'white' }} >Trailer&nbsp;#</TableCell>
                <TableCell align="right" sx={{ color: 'white' }} >Seal&nbsp;#</TableCell>
                <TableCell align="right" sx={{ color: 'white' }} >Carrier</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Driver&nbsp;Name</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Status</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {dataTwo.map((row, index) => (
                <TableRow key={row.Id || index} sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.200' }}>
                  <TableCell align="right">{row.dtmRegistrationDate}</TableCell>
                  <TableCell align="right">{row.dtmReceivedDate}</TableCell>
                  <TableCell align="right" >
                  <Link to={`${YARD_SUMMARY_ROUTE}/TrailerFolioHistory/${row.strTrailerFolio}`}>
                      {row.strTrailerFolio}
                    </Link>
                  </TableCell>

                  <TableCell align="right">{row.strTrailerNumber}</TableCell>


                  <TableCell align="right">{row.strSeal}</TableCell>
                  <TableCell align="right">{row.strCarrierLine}</TableCell>
                  <TableCell align="right">{row.strDriverName}</TableCell>
                  <TableCell align="right">{row.strStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Grid>

    </Grid  >
  );
  //return

}; //export const TrailerSearchGrid 
