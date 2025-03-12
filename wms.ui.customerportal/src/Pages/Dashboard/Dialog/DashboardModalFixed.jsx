import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { KPIAPI } from '../../../services/KPIAPI';
import { getTokenInfo } from '../../../utils';
import CustomAlert from '../../../components/Global/CustomAlert';

export const DashboardAddModalFixed = () => {
    const [baseOption, setBaseOption] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [idUserState, setIdUserState] = useState(null);
    const [animateFixed, setAnimateFixed] = useState(false);

    // Obtén el UserId cuando el componente se monta
    useEffect(() => {
        const token = getTokenInfo();
        if (token && token.nameid) {
            setIdUserState(parseInt(token.nameid));
        }
    }, []);

    // Al obtener el id del usuario, llama a la API para cargar la opción "Base"
    useEffect(() => {
        if (idUserState) {
            const fetchBaseOption = async () => {
                try {
                    const { data: options } = await KPIAPI.GetKPIOptions(idUserState);
                    const optionBase = options.find(
                        (opt) =>
                            opt.intModuleId &&
                            opt.intModuleId == 5 &&
                            opt.intActive === 1
                    );
                    if (optionBase) {
                        setBaseOption(optionBase);
                        setTimeout(() => setAnimateFixed(true), 1);
                    } else {
                        setAlert({
                            open: true,
                            message: 'No se encontró una opción Base activa',
                            severity: 'warning'
                        });
                    }
                } catch (error) {
                    console.error('Error fetching base option:', error);
                    setAlert({
                        open: true,
                        message: 'Error al obtener la opción Base',
                        severity: 'error'
                    });
                }
            };
            fetchBaseOption();
        }
    }, [idUserState]);

    if (!baseOption) {
        return (
            <CustomAlert
                open={alert.open}
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                message={alert.message}
            />
        );
    }

    return (
        <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{
                position: 'relative',
                left: '50%',
                top: '50%',
                width: '85%',
                height: '93vh',
                padding: 2,
                border: "1px solid #ccc",
                backgroundColor: "#eee",
                zIndex: 1000,
                color: "black",
                boxShadow: '3px 5px 5px rgba(0,0,0,0.6)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                opacity: animateFixed ? 1 : 0,
                transform: `translate(-50%, -50%) ${animateFixed ? 'scale(1)' : 'scale(0.6)'}`,
            }}
        >
            <Grid sx={{ pb: 1, backgroundColor: '#f0f0f0', color: '#000000', userSelect: 'none' }}>
                {baseOption.strDisplayText}
            </Grid>
            <Grid sx={{ height: 'calc(100% - 40px)' }}>
                <iframe
                    src={baseOption.strUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '5px',
                        pointerEvents: 'auto',
                    }}
                    allowFullScreen
                ></iframe>
            </Grid>
        </Grid>
    );
};