import React, {useEffect, useState} from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Grid, Stack } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getTokenInfo, useAuthRedirect } from '../../utils';
import { Outlet } from 'react-router-dom';
import { INVENTORY_ROUTE } from '../routes';
import { InventorySearchGrid } from './InventorySearchGrid';

export const Inventory = () => {
    useAuthRedirect();
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
    	}
	};
    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={BoxAStyle.backA}>
                <Stack sx={{ flexGrow: 1, height: '100%' }}>
                    <Box>
                        <div>
                            <Accordion defaultExpanded sx={BoxAStyle.AccordionC} >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header">Inventory
                                </AccordionSummary>
                                <AccordionDetails sx={BoxAStyle.BackGridA} >
                                    <InventorySearchGrid />
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
    )
}