import React from 'react';

import { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';

import { ControlVPdf } from './ControlVPdf';
import { Button, Grid } from '@mui/material';


export const CardPDFModal = ({ aintRecid, aintEventid, astrEventname, fnShowFileModal }) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '80vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };



  const handleClose = () => {
  
    fnShowFileModal(false);

  };
  return (
    <div>

    

      <Modal
        open={ true}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >


        <Box sx={style}>
         

          <ControlVPdf
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

//export default CardPDFModal;