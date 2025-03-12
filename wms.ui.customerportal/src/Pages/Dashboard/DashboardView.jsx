import React, { useEffect, useState } from 'react'
import { useAuthRedirect, getTokenInfo } from '../../utils';
import { DashboardModal } from './Dialog/DashboardModal';
import CustomAlert from '../../components/Global/CustomAlert';
import { Box, Grid } from '@mui/material';
import { DashboardAddModalFixed } from './Dialog/DashboardModalFixed';


export const DashboardView = () => {
	const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
	const [modals, setModals] = useState([]);
	const [userId, setUserId] = useState(null);

	useAuthRedirect();

	// Obtener el ID del usuario
	useEffect(() => {
		const tokenInfo = getTokenInfo(); // Supongamos que devuelve { nameid: '123' }
		if (tokenInfo && tokenInfo.nameid) {
			setUserId(tokenInfo.nameid);
		}
	}, []);

	// Cargar posiciones desde localStorage para el usuario actual
	useEffect(() => {
		if (userId) {
		  const storedSet = JSON.parse(localStorage.getItem(`modalsPosition_SET_${userId}`)) || [];
		  setModals(storedSet);
		}
	  }, [userId]);

	return (
		<Grid container sx={{ height: '100vh', overflow: 'hidden', overflowX: 'hidden', bgcolor: 'rgba(136, 165, 238, 0.72)' }}>
			{/* Panel fijo a la izquierda */}
			<Grid item xs={6} md={6} lg={6}
				sx={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					borderRight: '8px solid #0A3254',
				}}
			>
				<DashboardAddModalFixed />
			</Grid>
			{/* Área de modales movibles (lado derecho) */}
			<Grid item xs={6} md={6} lg={6} sx={{ position: 'relative', borderLeft: '8px solid #0A3254', }} >
				<Box sx={{ height: '90px' }} />
				<DashboardModal open={true} onClose={() => { }} modals={modals} setModals={setModals} userId={userId} staticMode={true} />
				<CustomAlert
					open={alert.open}
					onClose={() => setAlert({ ...alert, open: false })}
					severity={alert.severity}
					message={alert.message}
				/>
			</Grid>
		</Grid>
	)
}
