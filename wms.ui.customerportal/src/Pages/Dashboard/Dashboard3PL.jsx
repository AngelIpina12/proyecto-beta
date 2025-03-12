import React, { useEffect, useState } from 'react'
import { useAuthRedirect, getTokenInfo } from '../../utils';
import { DashboardModal } from './Dialog/DashboardModal';
import CustomAlert from '../../components/Global/CustomAlert';
import { Box, Grid } from '@mui/material';
import { DashboardAddModalFixed } from './Dialog/DashboardModalFixed';

export const Dashboard3PL = () => {
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
        <Grid container
            sx={{
                height: 'calc(100vh - 64px)',
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <DashboardAddModalFixed />
        </Grid>
    )
}
