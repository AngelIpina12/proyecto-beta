import React, { useEffect, useState } from 'react'
import { useAuthRedirect, getTokenInfo } from '../../utils';
import { DashboardAddModal } from './Dialog/DashboardAddModal';
import { DashboardModal } from './Dialog/DashboardModal';
import CustomAlert from '../../components/Global/CustomAlert';
import { Grid, Button } from '@mui/material';


export const DashboardSet = () => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [modals, setModals] = useState([]);
    const [userId, setUserId] = useState(null);

    useAuthRedirect();

    // Obtener el ID del usuario
    useEffect(() => {
        const tokenInfo = getTokenInfo();
        if (tokenInfo && tokenInfo.nameid) {
            setUserId(tokenInfo.nameid);
        }
    }, []);

    // Guardar posiciones en localStorage cada vez que cambien
    useEffect(() => {
        if (userId && modals.length > 0) {
            localStorage.setItem(`modalsPosition_SET_${userId}`, JSON.stringify(modals));
        }
    }, [modals, userId]);

    useEffect(() => {
        if (userId) {
            const storedModals = localStorage.getItem(`modalsPosition_SET_${userId}`);
            if (storedModals) {
                setModals(JSON.parse(storedModals));
            }
        }
    }, [userId]);

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
            localStorage.setItem(`modalsPosition_SET_${userId}`, JSON.stringify(newModals));
        }
        setAddModalOpen(false);
    };

    const handleAddModalAlert = (message, severity) => {
        setAlert({ open: true, message: message, severity: severity });
        setTimeout(() => { setAlert((prev) => ({ ...prev, open: false })) }, 3000);
    };

    return (
        <Grid container sx={{ height: '100vh', overflow: 'hidden', overflowX: 'hidden', bgcolor: 'rgba(136, 165, 238, 0.72)' }}>
            <Grid item xs={6} md={6} lg={6} sx={{ position: 'relative'}} >
                <Button
                    onClick={() => setAddModalOpen(true)}
                    sx={{
                        width: '30%',
                        p: 1,
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        m: 3,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                        transition: '0.3s ease',
                        '&:hover': {
                            backgroundColor: '#009bff'
                        },
                    }}
                >
                    Agregar Modal
                </Button>
                <DashboardAddModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onAdd={handleAddModal}
                    onAddAlert={handleAddModalAlert}
                />
                <DashboardModal open={true} onClose={() => { }} modals={modals} setModals={setModals} userId={userId} staticMode={false}/>
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
