import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Chip, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { EventComp } from './EventComp';
import { YardAPI } from '@/services/YardAPI';
import { YARD_SUMMARY_ROUTE } from '../../Pages/routes';



export const TrailerFolioHistory = () => {

  const [data, setData] = useState([]);
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const singleDat = { strFolio: id };
  
      try {
        const retobject = await YardAPI.TrailerHistory({ singleDat });
        setData(retobject.data);
      } catch (error) {
        console.error("trailerError:", error);
      }
    };

    fetchData();
  }, [id]); // fin useEffect

  const handleClose = () => {
    navigate(YARD_SUMMARY_ROUTE);
  };
  
  return (
    <Stack direction="column" spacing={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton onClick={handleClose}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Chip label={id} sx={{ width: '100%' }} />
        </Box>
      </Stack>
      <Stack direction="row" spacing={1}>
        {data.map((item, index) => (
          <EventComp
          key={`${item.strFolio}-${index}`}
            aEventName={item.strEvent}
            aEventDate={item.dtmEventDate}
            aRecFolio={item.strFolio}
            aTRFolio={item.strFolio}
            aintRTrailerId={item.intRecTrailerId}
            aintEventId={item.intEventId}
          />
        ))}
      </Stack>
    </Stack>
  );
}
