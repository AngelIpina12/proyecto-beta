import React, {useEffect, useState} from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Grid, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getTokenInfo, useAuthRedirect } from '../../utils';
import { Outlet } from 'react-router-dom';
import { ShippingSearchGrid } from './ShippingSearchGrid';
import { ShippingAPI } from '../../services/ShippingAPI';
import { SHIPPING_ROUTE } from '../routes';

export const ShippingSummary = () => {
    useAuthRedirect();

    const [idUser, setIdUser] = useState('')
    const [summaryData, setSummaryData] = useState('')
    const [totalShips, setTotalShips] = useState(0)
    const [totalLoadedOut, setTotalLoadedOut] = useState(0)
    const [totalRequirements, setTotalRequierements] = useState(0)
    const [totalEmptyOut, setTotalEmptyOut] = useState(0)
    const [totalPallets, setTotalPallets] = useState(0)
    const [statusValueToday, setStatusValueToday] = useState(0);

    const updateStatusValueToday = (newValue) => {
        setStatusValueToday(newValue);
    };
    
    useEffect(() => { // Obtener el token
        const ldata = getTokenInfo();
        let lintid = ldata.nameid;
        setIdUser(lintid);
    }, []);

    useEffect(() => { // Consultar cuando ya haya token
        if (idUser) {
            const fetchData = async () => {
                try {
                    const response = await ShippingAPI.GetShipTodaySummary(idUser);
                    setSummaryData(response.data);
                } catch (error) {
                    console.log('Error fetching data: ', error);
                }
            };
            fetchData();
        }
    }, [idUser]);

    useEffect(() => { //Cuando ya haya datos llenar los totales
        if(summaryData){
            setTotalShips(summaryData[0].lint_TotalShip);
            setTotalLoadedOut(summaryData[0].lint_LoadedOut);
            setTotalEmptyOut(summaryData[0].lint_EmptyOut);
            setTotalRequierements(summaryData[0].lint_TotalReqs);
            setTotalPallets(summaryData[0].lint_TotalPallets);
        }
    }, [summaryData]);

    const BoxAStyle = {
		backA: {
			backgroundColor: '#FFFFFF',
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		AccordionC: {
			bgcolor: '#ebcf33',
			color: '#44556f'
		},
		BackGridA: {
			bgcolor: '#FFFFFF',
			color: '#ebcf33'
    	},
        partToTYToday:
        {
            bgcolor: '#5b89b4',
            color: '#FFFFFF',
            fontSize: '1.5rem'
        },
        backD: {
            bgcolor: '#ebcf33',
            color: '#44556f',
            fontSize: '1.5rem',
            textTransform: 'none'
        },
	};

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={BoxAStyle.backA}>
                <Stack sx={{ flexGrow: 1, height: '100%' }}>
                    <Box>
                        <div>
                            <Accordion defaultExpanded sx={BoxAStyle.AccordionC} >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} 
                                    aria-controls="panel1-content" id="panel1-header">Shipping Summary</AccordionSummary>
                                <AccordionDetails sx={BoxAStyle.BackGridA}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                                            <Chip label="Total Shipments" color="primary" sx={BoxAStyle.partToTYToday} />
                                            <Chip label={`${totalShips}`} color="secondary" sx={BoxAStyle.partToTYToday} />
                                        </Box>
                                        <Box display="flex" flexDirection="column" gap={2} width="100%">
                                            <Box display="flex" justifyContent="space-around" alignItems="flex-start" gap={2}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Chip label="Loaded Out" sx={BoxAStyle.backD}/>
                                                    <Chip label={totalLoadedOut} sx={BoxAStyle.backD}/>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Chip label="Requierements" sx={BoxAStyle.backD}/>
                                                    <Chip label={totalRequirements} sx={BoxAStyle.backD}/>
                                                </Box>
                                            </Box>
                                            <Box display="flex" justifyContent="space-around" alignItems="flex-start" gap={2}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Chip label="Empty Out" sx={BoxAStyle.backD}/>
                                                    <Chip label={totalEmptyOut} sx={BoxAStyle.backD}/>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Chip label="Total Pallets" sx={BoxAStyle.backD}/>
                                                    <Chip label={totalPallets} sx={BoxAStyle.backD}/>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={BoxAStyle.AccordionC}>
                                <AccordionSummary 
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header">
                                    Search
                                </AccordionSummary>
                            <AccordionDetails sx={BoxAStyle.BackGridA} >
                                {location.pathname === SHIPPING_ROUTE && (
                                    <ShippingSearchGrid
                                    statusValueToday={statusValueToday}
                                    updateStatusValueToday={updateStatusValueToday} />
                                )}
                                <Outlet />
                            </AccordionDetails>
                            </Accordion>
                        </div>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}