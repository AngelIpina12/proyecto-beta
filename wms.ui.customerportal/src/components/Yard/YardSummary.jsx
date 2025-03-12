import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Chip, Grid, Stack } from '@mui/material';

import { YardAPI } from '@/services/YardAPI';
import { getTokenInfo, useAuthRedirect } from '../../utils';
import { TrailerSearchGrid } from './TrailerSearchGrid';
import { YARD_SUMMARY_ROUTE } from '../../Pages/routes';
import { ReceiveAPI } from '@/services/ReceiveAPI';


export const YardSummary = () => {
  useAuthRedirect();
  
  const [Iduserstate, setIduserstate] = useState('')
  
  const [TotalTrailersYardstate, setTotalTrailersYardstate] = useState('')
  const [TotalTrailersEmptyInstate, setTotalTrailersEmptyInstate] = useState('')
  const [TotalTrailersEmptyOutstate, setTotalTrailersEmptyOutstate] = useState('')
  const [TotalTrailersUnloadingPstate, setTotalTrailersUnloadingPstate] = useState('')
  const [TotalTrailersYardLoadInstate, setTotalTrailersYardLoadInstate] = useState('')
  const [TotalTrailersYardLoadOutstate, setTotalTrailersYardLoadOutstate] = useState('')
  const [TotalTrailersLoadingPstate, setTotalTrailersLoadingPstate] = useState('')
  const [statusValueToday, setStatusValueToday] = useState(0);

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


  const updateStatusValueToday = (newValue) => {
    setStatusValueToday(newValue);
  };

  const strGetDataError = "'Error Obtener informacion '";


  ///
  const BoxAStyle = {
    root: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      overflow: "auto",
      height: '100%',
      width: '100%',
    },
    backA: {
      backgroundColor: '#FFFFFF',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    backB: {
      color: '#1414b8',
      bgcolor: '#FFFFFF'
    },

    backC: {
      color: '#ffde44',
      borderBottomWidth: 10
    },

    backD: {
      bgcolor: '#ebcf33', // amarillo  //bgold  ffde44 // gas ffdf46// e6c31e
      color: '#44556f',// azul --'#44556f'
      fontSize: '1.5rem' 
    },
    partToTYToday:
    {
      bgcolor: '#5b89b4',// skyblue
      color: '#FFFFFF',// blanc
      fontSize: '1.5rem'
    },
    
    AccordionC: {
      bgcolor: '#ebcf33', // amarillo  //bgold  ffde44 // gas ffdf46// e6c31e
      color: '#44556f' // azul --'#44556f'

    },
   
    BackGridA: {
      bgcolor: '#FFFFFF', // blanco// azul --'#44556f' //bgold  ffde44 // gas ffdf46// e6c31e
      color: '#ebcf33' // amarillo  


    }
  };
  //
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ldata = getTokenInfo();
        const lintid = ldata.nameid;
  
        if (lintid > 0) {
          const singleDat = { UserId: lintid };
  
          try {
            const retobject = await YardAPI.YardTrailerSummary({ singleDat });
  
            if (retobject.data[0].userId > 0) {
              const data = retobject.data[0];
              setIduserstate(data.userId);
              setTotalTrailersYardstate(data.totalTrailersYard);
              setTotalTrailersEmptyInstate(data.totalTrailersEmptyIn);
              setTotalTrailersEmptyOutstate(data.totalTrailersEmptyOut);
              setTotalTrailersUnloadingPstate(data.totalTrailersUnloadingP);
              setTotalTrailersYardLoadInstate(data.totalTrailersYardLoadIn);
              setTotalTrailersYardLoadOutstate(data.totalTrailersYardLoadOut);
              setTotalTrailersLoadingPstate(data.totalTrailersLoadingP);
            }

           //const bldata = getTokenInfo();
           //const blintid = bldata.nameid;
          // const FilterDat = { UserId: blintid };
           // const aretobject = await ReceiveAPI.GetTodayReceiveList({ FilterDat });

            //const FilterDat = { strRECFolio: "RECTAS4" ,};
            //const aretobject = await ReceiveAPI.GetByTrailerFolioReceiveList({ FilterDat });

           // const FilterDat = { strRECFolio: "RECBOR4438", strSKU:"53031510012" };
           // const aretobject = await ReceiveAPI.GetReceiveSKUAndFolioInfo({ FilterDat });

          // const FilterDat = { "intUserId": 325, "intEndCustomerId": null, "strCustomerName": "bor", "dtmStartDate": "2023-03-17", "dtmEndDate": "2023-03-17" };
          //  const aretobject = await ReceiveAPI.GetReceiveListByCustomerDate({ FilterDat });

          //  const FilterDat = { "strCustomerName": "bor" };
          //  const aretobject = await ReceiveAPI.GetEndCustomerCatalog({ FilterDat });

            //const FilterDat = {              "strSKU": "tarim"
           ///   , "intUserId": 3025
           //   , "dtmStartDate": "2023-11-27"
           //   , "dtmEndtDate": "2023-12-05"};
 //           const aretobject = await ReceiveAPI.GetReceiveListBySKUDate({ FilterDat });

          //console.log(aretobject);


          } catch (error) {
            console.error("Error fetching YardTrailerSummary:", error);
          }
        }
      } catch (error) {
        console.error("Error getting token info:", error);
      }
    };
  
    fetchData();
  }, []); // fin useEffect

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      <Box sx={BoxAStyle.backA}>


        <Stack sx={{ flexGrow: 1, height: '100%' }}>

          <Box >

            <div>

              <Accordion defaultExpanded sx={BoxAStyle.AccordionC}  >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"

                >
                  Yard Daily Summary
                </AccordionSummary>

                <AccordionDetails sx={BoxAStyle.BackGridA} >

                  <Grid container direction="row" spacing={8} >

                    <Grid item >

                      <Stack spacing={2}>
                        <Grid></Grid>

                        <Grid container direction="row" spacing={2} >
                          <Grid item >
                            <Chip label="Total Trailers in Yard Today" sx={BoxAStyle.partToTYToday} />
                          </Grid  >

                          <Grid item >
                            <Chip label={TotalTrailersYardstate} sx={BoxAStyle.partToTYToday} />
                          </Grid  >

                        </Grid>

                        <Grid></Grid>

                      </Stack>

                    </Grid>

                    <Grid item >
                      <Grid container direction="row" spacing={8} alignItems="flex-start">

                        <Grid item  >
                          <Stack spacing={2}>

                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                              <Grid item sx={{ flexGrow: 1 }}>
                                <Grid container direction="row">
                                  <Grid item>
                                    <Button onClick={() => setStatusValueToday(5)}>
                                      <Chip label="Yard Empty IN" sx={BoxAStyle.backD} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid container direction="row" spacing={3}>
                                  <Grid item>
                                    <Chip label={TotalTrailersEmptyInstate} sx={BoxAStyle.backD} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                              <Grid item sx={{ flexGrow: 1 }}>
                                <Grid container direction="row">
                                  <Grid item>
                                    <Button onClick={() => setStatusValueToday(6)}>
                                      <Chip label="Yard Empty OUT" sx={BoxAStyle.backD} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid container direction="row" spacing={3}>
                                  <Grid item>
                                    <Chip label={TotalTrailersEmptyOutstate} sx={BoxAStyle.backD} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                              <Grid item sx={{ flexGrow: 1 }}>
                                <Grid container direction="row">
                                  <Grid item>
                                    <Button onClick={() => setStatusValueToday(7)}>
                                      <Chip label="Unloading Process" sx={BoxAStyle.backD} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid container direction="row" spacing={3}>
                                  <Grid item>
                                    <Chip label={TotalTrailersUnloadingPstate} sx={BoxAStyle.backD} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                            
                          </Stack>
                        </Grid  >

                        <Grid item >
                          <Stack spacing={2}>

                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                              <Grid item sx={{ flexGrow: 1 }}>
                                <Grid container direction="row">
                                  <Grid item>
                                    <Button onClick={() => setStatusValueToday(8)}>
                                      <Chip label="Yard Loaded IN" sx={BoxAStyle.backD} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid container direction="row" spacing={3}>
                                  <Grid item>
                                    <Chip label={TotalTrailersYardLoadInstate} sx={BoxAStyle.backD} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                              <Grid item sx={{ flexGrow: 1 }}>
                                <Grid container direction="row">
                                  <Grid item>
                                    <Button onClick={() => setStatusValueToday(9)}>
                                      <Chip label="Yard Loaded Out" sx={BoxAStyle.backD} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid container direction="row" spacing={3}>
                                  <Grid item>
                                    <Chip label={TotalTrailersYardLoadOutstate} sx={BoxAStyle.backD} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                              <Grid item sx={{ flexGrow: 1 }}>
                                <Grid container direction="row">
                                  <Grid item>
                                    <Button onClick={() => setStatusValueToday(10)}>
                                      <Chip label="Loading Process" sx={BoxAStyle.backD} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid container direction="row" spacing={3}>
                                  <Grid item>
                                    <Chip label={TotalTrailersLoadingPstate} sx={BoxAStyle.backD} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                          </Stack>
                        </Grid  >

                      </Grid>
                    </Grid>

                  </Grid>

                </AccordionDetails>
              </Accordion>

              <Accordion sx={BoxAStyle.AccordionC}  >

                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Search
                </AccordionSummary>

                <AccordionDetails sx={BoxAStyle.BackGridA} >
                  {location.pathname === YARD_SUMMARY_ROUTE && (
                    <TrailerSearchGrid
                      statusValueToday={statusValueToday}
                      updateStatusValueToday={updateStatusValueToday}
                    />
                  )}
                  <div>
                    <Outlet />
                  </div>
                </AccordionDetails>

              </Accordion>

            </div>

          </Box>

        </Stack>

      </Box>

    </Box>

  ); // return

};
