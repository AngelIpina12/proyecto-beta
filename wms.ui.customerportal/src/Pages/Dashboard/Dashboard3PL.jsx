import React from 'react'
import { useAuthRedirect } from '../../utils';
import { Grid } from '@mui/material';
import { DashboardAddModalFixed } from './Dialog/DashboardModalFixed';

export const Dashboard3PL = () => {
    useAuthRedirect();

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
