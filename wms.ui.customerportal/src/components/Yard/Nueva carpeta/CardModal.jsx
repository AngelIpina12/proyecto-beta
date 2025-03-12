import React from 'react';

import  { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';

import { Controlcard } from './Controlcard';
import { Button, Grid } from '@mui/material';

export const CardModal = ({ aintRecid, aintEventid, astrEventname, fnShowModal }  ) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '70vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  

  const handleClose = () => {

    fnShowModal(false);

  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
       
        
        <Box sx={style}>
    
          <Controlcard
            astrEventname={astrEventname}
            aintRTrailerId={aintRecid}
            aintEventId={aintEventid}
          />
        
    

          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
          >
            <Button variant="contained" color="primary" onClick={handleClose}>
              Close
            </Button>

          </Grid>

          </Box>
        
      </Modal>

    </div>
  );

};

/*export default CardModal;*/