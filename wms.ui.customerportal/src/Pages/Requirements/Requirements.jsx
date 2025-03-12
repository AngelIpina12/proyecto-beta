import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { 
	Accordion, 
	AccordionDetails, 
	AccordionSummary, 
	Box,
	Stack 
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { userAPI } from '../../services/userAPI';
import { REQUIREMENTS_ROUTE } from '../routes';

import LoadingOverlay from '../../components/Global/LoadingOverlay';
import { RequirementsSearchGrid } from './RequirementsSearchGrid';
import { getToken, getTokenInfo, useAuthRedirect } from '../../utils';

export const Requirements = () => {
	useAuthRedirect();
	const [isLoading, setIsLoading] = useState(false);
	const [idUserState, setIdUserState] = useState();
	const [customerData, setCustomerData] = useState({
		customerName: '',
		customerId: ''
	})

	// Obtener el UserId
	useEffect(() => {
		const ldata = getTokenInfo();
		const token = getToken();
		let lintid = ldata.nameid;
		const singleDat = {
			UserId: lintid,
			UserName: "",
			PWD: "",
			Type: ""
		};
	
		if (singleDat.UserId > 0) {
		const fetchData = async () => {
			try {
				const retobject = await userAPI.getUserInfo({
					singleDat,
					headers: {
					'Authorization': `Bearer ${token}`
					}
				});
		
				if (retobject.data[0].userId > 0) {
					setCustomerData({customerName: retobject.data[0].customer, wareCustomerId: retobject.data[0].wareCustomerId, customerId: retobject.data[0].customerId})
				}
			} catch (error) {
			console.error("userError:", error);
			}
		}
		fetchData();
		}
		setIdUserState(lintid);
	}, []);


	const BoxAStyle = {
		backA: {
			backgroundColor: '#FFFFFF',
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			overflow: 'hidden',
		},
		AccordionC: {
			bgcolor: '#ebcf33', // amarillo  //bgold  ffde44 // gas ffdf46// e6c31e
			color: '#44556f', // azul --'#44556f'
			maxWidth: '100%',
		},
		BackGridA: {
			bgcolor: '#FFFFFF', // blanco// azul --'#44556f' //bgold  ffde44 // gas ffdf46// e6c31e
			color: '#ebcf33', // amarillo  
			maxWidth: '100%',
    	}
	};

  return (
	<>
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
								>Requirements
								</AccordionSummary>
								<AccordionDetails sx={BoxAStyle.BackGridA} >
									{/* Tabla y combos de los datos principales */}
									{location.pathname === REQUIREMENTS_ROUTE && ( <RequirementsSearchGrid customerData={customerData} setIsLoading={setIsLoading}/> )}
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
		<LoadingOverlay isLoading={isLoading} />
	</>
  )
}
