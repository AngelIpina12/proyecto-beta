import React, {useEffect, useState} from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Grid, Stack } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getTokenInfo, useAuthRedirect } from '../../utils';
import { Outlet } from 'react-router-dom';
import { RECEIVES_ROUTE } from '../routes';
import { ReceivesSearchGrid } from './ReceivesSearchGrid';



export const Receives = () => {
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
			bgcolor: '#ebcf33', // amarillo  //bgold  ffde44 // gas ffdf46// e6c31e
			color: '#44556f' // azul --'#44556f'
		},
		BackGridA: {
			bgcolor: '#FFFFFF', // blanco// azul --'#44556f' //bgold  ffde44 // gas ffdf46// e6c31e
			color: '#ebcf33' // amarillo  
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
									id="panel1-header"
								>Receives
								</AccordionSummary>
								<AccordionDetails sx={BoxAStyle.BackGridA} >
									{location.pathname === RECEIVES_ROUTE && (
										<ReceivesSearchGrid 
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
	);
};
