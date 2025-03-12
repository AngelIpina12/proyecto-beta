import React from 'react';
import { Box, Typography } from '@mui/material';

const lstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height :600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


  export const PDFObj = ({ afile_url }) => {
    return (
      <Box sx={lstyle}>

        <div>
        

          <iframe
            src={afile_url}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
          <Typography gutterBottom variant="body2" component="div">
            {afile_url}
          </Typography>
        </div>
        
      </Box>
    );
  };


//export default PDFObj;