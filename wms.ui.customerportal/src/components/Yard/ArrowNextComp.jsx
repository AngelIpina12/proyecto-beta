import React from 'react';
import Box from '@mui/material/Box';

import { CardMedia  } from '@mui/material';
import arrow1G from '@/assets/arrow1G.png';

export const ArrowNextComp = () => {



  return (    
    <CardMedia
      component={"img"}
      sx={{
        height: 20,
        width: 30,
        
      }}

      src={arrow1G}
    />

  );

}