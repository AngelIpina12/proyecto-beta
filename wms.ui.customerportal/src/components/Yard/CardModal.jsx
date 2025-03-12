import React from 'react';

import { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';

import { Controlcard } from './Controlcard';
import { Button, Grid } from '@mui/material';

export const CardModal = ({ aintRecid, aintEventid, astrEventname, fnShowModal }) => {

  const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '70vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    position: 'relative',
  };


  //const handleOpen = () => {
  //  setOpen(true);
  //};
  const handleClose = () => {
    //  setOpen(false);
    fnShowModal(false);

  };
  return (
    <div>

      {/* <button onClick={handleOpen}>Abrir Modal</button>*/}

      <Modal
        open={true}  // Si se renderiza, el modal se muestra
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Controlcard
            aEventName={astrEventname}
            aintRTrailerId={aintRecid}
            aintEventId={aintEventid}
          />
          <Box  sx={{ position: 'absolute', bottom: 16, right: 16 }}>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

    </div>
  );

};

/*export default CardModal;*/