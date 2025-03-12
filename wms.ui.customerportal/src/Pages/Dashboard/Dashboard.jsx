import React, { useEffect, useState } from 'react'
import { useAuthRedirect, getTokenInfo } from '../../utils';
import { DashboardAddModal } from './Dialog/DashboardAddModal';
import { DashboardModal } from './Dialog/DashboardModal';
import CustomAlert from '../../components/Global/CustomAlert';


export const Dashboard = () => {
	const [addModalOpen, setAddModalOpen] = useState(false);
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
			const savedModals = JSON.parse(localStorage.getItem(`modalsPosition_${userId}`));
			if (savedModals && Array.isArray(savedModals)) {
				setModals(savedModals);
			}
		}
	}, [userId]);

	// Guardar posiciones en localStorage cada vez que cambien
	useEffect(() => {
		if (userId) {
			localStorage.setItem(`modalsPosition_${userId}`, JSON.stringify(modals));
		}
	}, [modals, userId]);


	const handleAddModal = (newModal) => {
		const newModals = [
			...modals,
			{
				id: Math.round(Math.random() * 1000),
				x: 100,
				y: 100,
				width: 600,
				height: 330,
				name: newModal.name || "Nuevo Modal",
				url: newModal.url || "",
			},
		];
		setModals(newModals);
		if (userId) {
			localStorage.setItem(`modalsPosition_${userId}`, JSON.stringify(newModals));
		}
		setAddModalOpen(false);
	};

	const handleAddModalAlert = (message, severity) => {
		setAlert({ open: true, message: message, severity: severity });
		setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
	};

	return (
		<>
			{/* Se retira el boton para agregar modales */}
			{/* <button 
        		onClick={() => setAddModalOpen(true)}
				style={{
						width: '12.5%', // Una octava parte del ancho total
						padding: '10px',
						borderRadius: '5px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						cursor: 'pointer',
					}}
				>
				Agregar Modal
			</button> */}
			<DashboardAddModal
				open={addModalOpen}
				onClose={() => setAddModalOpen(false)}
				onAdd={handleAddModal}
				onAddAlert={handleAddModalAlert}
			/>
			<DashboardModal
				open={true}
				onClose={() => { }}
				modals={modals}
				setModals={setModals}
			/>
			<CustomAlert
				open={alert.open}
				onClose={() => setAlert({ ...alert, open: false })}
				severity={alert.severity}
				message={alert.message}
			/>
		</>
	)
}
